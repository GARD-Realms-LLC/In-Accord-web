import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';

const router = Router();
// __dirname when this file runs is server/src/routes
// So: __dirname/../../.. = server/src/routes/../../.. = root/
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const backupDir = path.join(repoRoot, 'backups');
const backupSettingsPath = path.join(repoRoot, 'server', 'data', 'backupSettings.json');

console.log('[backup] init: repoRoot =', repoRoot);
console.log('[backup] init: backupDir =', backupDir);

function ensureDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) {
      console.log('[backup] creating backupDir:', dir);
      fs.mkdirSync(dir, { recursive: true });
      console.log('[backup] backupDir created successfully');
    }
  } catch (err) {
    console.error('[backup] failed to create backupDir:', dir, err);
    throw err;
  }
}

function safeReadJson(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[backup] failed to read sample file', filePath, err);
    return null;
  }
}

type BackupSettings = {
  localBackupPath: string;
  r2AccountId: string;
  r2ApiToken: string;
  r2Bucket: string;
  r2Prefix: string;
};

const defaultSettings: BackupSettings = {
  localBackupPath: path.join(repoRoot, 'backups'),
  r2AccountId: '',
  r2ApiToken: '',
  r2Bucket: '',
  r2Prefix: 'In-Accord Backups',
};

function loadBackupSettings(): BackupSettings {
  try {
    if (!fs.existsSync(backupSettingsPath)) return { ...defaultSettings };
    const raw = fs.readFileSync(backupSettingsPath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed,
    } as BackupSettings;
  } catch (err) {
    console.warn('[backup] failed to read backupSettings, using defaults', err);
    return { ...defaultSettings };
  }
}

function saveBackupSettings(next: BackupSettings) {
  try {
    ensureDir(path.dirname(backupSettingsPath));
    fs.writeFileSync(backupSettingsPath, JSON.stringify(next, null, 2), 'utf8');
  } catch (err) {
    console.error('[backup] failed to persist backupSettings', err);
    throw err;
  }
}
router.get('/settings', (_req: Request, res: Response) => {
  const settings = loadBackupSettings();
  // Return the token as-is so the UI can reuse; consider masking in a real deployment
  return res.json({ ok: true, settings });
});

router.put('/settings', (req: Request, res: Response) => {
  const body = req.body || {};
  const current = loadBackupSettings();
  const next: BackupSettings = {
    localBackupPath: (body.localBackupPath ?? current.localBackupPath ?? defaultSettings.localBackupPath).trim(),
    r2AccountId: (body.r2AccountId ?? current.r2AccountId ?? '').trim(),
    r2ApiToken: (body.r2ApiToken ?? current.r2ApiToken ?? '').trim(),
    r2Bucket: (body.r2Bucket ?? current.r2Bucket ?? '').trim(),
    r2Prefix: (body.r2Prefix ?? current.r2Prefix ?? '').trim(),
  };
  saveBackupSettings(next);
  return res.json({ ok: true, settings: next });
});

async function uploadToR2({
  json,
  accountId,
  apiToken,
  bucket,
  prefix,
  fileName,
}: {
  json: string;
  accountId: string;
  apiToken: string;
  bucket: string;
  prefix: string;
  fileName: string;
}) {
  const objectKey = prefix ? `${prefix}/${fileName}` : fileName;
  const encodedKey = objectKey.split('/').map(part => encodeURIComponent(part)).join('/');

  const options: https.RequestOptions = {
    method: 'PUT',
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucket)}/objects/${encodedKey}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(json, 'utf8'),
    },
  };

  console.log('[backup] uploading to R2', { bucket, objectKey, path: options.path });

  await new Promise<void>((resolve, reject) => {
    const uploadReq = https.request(options, (uploadRes) => {
      let body = '';
      uploadRes.on('data', (chunk) => { body += chunk; });
      uploadRes.on('end', () => {
        if (uploadRes.statusCode && uploadRes.statusCode >= 200 && uploadRes.statusCode < 300) {
          console.log('[backup] R2 upload success', { statusCode: uploadRes.statusCode });
          return resolve();
        }
        const errMsg = `[backup] R2 upload failed (${uploadRes.statusCode}): ${body || uploadRes.statusMessage}`;
        console.error(errMsg);
        return reject(new Error(errMsg));
      });
    });

    uploadReq.on('error', (uploadErr) => {
      console.error('[backup] R2 upload network error', uploadErr);
      reject(uploadErr);
    });

    uploadReq.write(json);
    uploadReq.end();
  });
}

router.post('/test', async (req: Request, res: Response) => {
  try {
    const incoming = req.body?.r2Config || {};
    const stored = loadBackupSettings();
    const rawAccountId = (incoming.accountId ?? stored.r2AccountId ?? '').trim();
    const rawBucket = (incoming.bucket ?? stored.r2Bucket ?? '').trim();
    const apiToken = (incoming.apiToken ?? stored.r2ApiToken ?? '').trim();
    const userPrefix = (incoming.prefix ?? stored.r2Prefix ?? '').trim();

    const accountMatch = rawAccountId.match(/[a-f0-9]{32}/i);
    const accountId = accountMatch ? accountMatch[0] : rawAccountId;

    const bucketSegments = rawBucket.split(/[\\/]+/).filter(Boolean);
    const bucket = bucketSegments[0];
    const bucketPrefix = bucketSegments.slice(1).join('/') || '';
    const combinedPrefix = [bucketPrefix, userPrefix].filter(Boolean).join('/');
    const normalizedPrefix = combinedPrefix.replace(/^\/+|\/+$/g, '');

    if (!accountId || !apiToken || !bucket) {
      return res.status(400).json({ ok: false, error: 'Missing R2 configuration (accountId, apiToken, bucket required).' });
    }

    const fileName = 'r2-connection-test.txt';
    const json = `R2 connection test at ${new Date().toISOString()}`;

    await uploadToR2({ json, accountId, apiToken, bucket, prefix: normalizedPrefix, fileName });

    return res.json({ ok: true, message: `R2 test object uploaded to ${bucket}/${normalizedPrefix ? normalizedPrefix + '/' : ''}${fileName}` });
  } catch (err) {
    console.error('[backup] R2 test failed', err);
    return res.status(500).json({ ok: false, error: 'R2 connection test failed', detail: String((err as Error)?.message || err) });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { location, localPath, r2Config } = req.body as {
    location?: 'local' | 'cloud' | 'both';
    localPath?: string;
    r2Config?: {
      accountId?: string;
      apiToken?: string;
      bucket?: string;
      prefix?: string;
    };
  };
  const loc = location || 'local';
  if (!['local', 'cloud', 'both'].includes(loc)) {
    return res.status(400).json({ ok: false, error: 'invalid location' });
  }

  try {
    console.log('[backup] start request', { loc });
    console.log('[backup] repoRoot resolved to:', repoRoot);
    console.log('[backup] backupDir resolved to:', backupDir);
    const storedSettings = loadBackupSettings();
    const targetDir = (localPath && localPath.trim()) ? localPath.trim() : (storedSettings.localBackupPath || backupDir);
    ensureDir(targetDir);

    const timestamp = new Date();
    const stamp = timestamp.toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDhhmmss
    const fileName = `backup-${stamp}-${loc}.json`;
    const filePath = path.join(targetDir, fileName);

    console.log('[backup] writing to:', filePath);

    const users = safeReadJson(path.join(repoRoot, 'server', 'data', 'users.json'));
    const sessions = safeReadJson(path.join(repoRoot, 'server', 'data', 'sessions.json'));

    const payload = {
      createdAt: timestamp.toISOString(),
      location: loc,
      note: 'Local demo backup generated by admin Run Now.',
      includes: {
        users: Array.isArray(users) ? users.length : (users?.users?.length ?? 0),
        sessions: Array.isArray(sessions) ? sessions.length : 0,
      },
      data: {
        users,
        sessions,
      },
    };

    const json = JSON.stringify(payload, null, 2);
    console.log('[backup] about to write', Buffer.byteLength(json, 'utf8'), 'bytes to:', filePath);
    fs.writeFileSync(filePath, json, 'utf8');
    console.log('[backup] writeFileSync completed');

    // Verify the file was actually written before claiming success
    const exists = fs.existsSync(filePath);
    const stat = exists ? fs.statSync(filePath) : null;
    console.log('[backup] file existence check:', { exists, filePath, statSize: stat?.size });
    
    if (!exists) {
      throw new Error(`File was not written or not found after write: ${filePath}`);
    }

    const sizeBytes = Buffer.byteLength(json, 'utf8');
    console.log('[backup] saved', { filePath, sizeBytes, statSize: stat?.size, fileExists: exists });

    let detail = `Saved backup locally: ${filePath} (${(sizeBytes / (1024 * 1024)).toFixed(2)} MB)`;
    let r2Uploaded = false;

    if (loc === 'cloud' || loc === 'both') {
      const rawAccountId = (r2Config?.accountId ?? storedSettings.r2AccountId ?? '').trim();
      const rawBucket = (r2Config?.bucket ?? storedSettings.r2Bucket ?? '').trim();
      const apiToken = (r2Config?.apiToken ?? storedSettings.r2ApiToken ?? '').trim();
      const userPrefix = (r2Config?.prefix ?? storedSettings.r2Prefix ?? '').trim();

      const accountMatch = rawAccountId.match(/[a-f0-9]{32}/i);
      const accountId = accountMatch ? accountMatch[0] : rawAccountId;

      const bucketSegments = rawBucket.split(/[\\/]+/).filter(Boolean);
      const bucket = bucketSegments[0];
      const bucketPrefix = bucketSegments.slice(1).join('/') || '';
      const combinedPrefix = [bucketPrefix, userPrefix].filter(Boolean).join('/');
      const normalizedPrefix = combinedPrefix.replace(/^\/+|\/+$/g, '');

      if (!accountId || !apiToken || !bucket) {
        throw new Error('Cloud backup requested but R2 configuration is incomplete (need accountId, apiToken, bucket)');
      }

      await uploadToR2({ json, accountId, apiToken, bucket, prefix: normalizedPrefix, fileName });

      r2Uploaded = true;
      const objectKey = normalizedPrefix ? `${normalizedPrefix}/${fileName}` : fileName;
      detail = `${detail} + uploaded to R2: ${bucket}/${objectKey}`;
    }

    return res.json({
      ok: true,
      fileName,
      filePath,
      sizeBytes,
      r2Uploaded,
      detail,
    });
  } catch (err) {
    console.error('[backup] failed to write backup', err);
    return res.status(500).json({ ok: false, error: 'Failed to write backup file', detail: String((err as Error)?.message || err) });
  }
});

export default router;
