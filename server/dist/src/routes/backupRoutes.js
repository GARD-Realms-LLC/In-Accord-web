"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const router = (0, express_1.Router)();
// __dirname when this file runs is server/src/routes
// So: __dirname/../../.. = server/src/routes/../../.. = root/
const repoRoot = path_1.default.resolve(__dirname, '..', '..', '..');
const backupDir = path_1.default.join(repoRoot, 'backups');
const backupSettingsPath = path_1.default.join(repoRoot, 'server', 'data', 'backupSettings.json');
console.log('[backup] init: repoRoot =', repoRoot);
console.log('[backup] init: backupDir =', backupDir);
function ensureDir(dir) {
    try {
        if (!fs_1.default.existsSync(dir)) {
            console.log('[backup] creating backupDir:', dir);
            fs_1.default.mkdirSync(dir, { recursive: true });
            console.log('[backup] backupDir created successfully');
        }
    }
    catch (err) {
        console.error('[backup] failed to create backupDir:', dir, err);
        throw err;
    }
}
function safeReadJson(filePath) {
    try {
        if (!fs_1.default.existsSync(filePath))
            return null;
        const raw = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    }
    catch (err) {
        console.warn('[backup] failed to read sample file', filePath, err);
        return null;
    }
}
const defaultSettings = {
    localBackupPath: path_1.default.join(repoRoot, 'backups'),
    r2AccountId: '',
    r2ApiToken: '',
    r2Bucket: '',
    r2Prefix: 'In-Accord Backups',
};
function loadBackupSettings() {
    try {
        if (!fs_1.default.existsSync(backupSettingsPath))
            return Object.assign({}, defaultSettings);
        const raw = fs_1.default.readFileSync(backupSettingsPath, 'utf8');
        const parsed = JSON.parse(raw);
        return Object.assign(Object.assign({}, defaultSettings), parsed);
    }
    catch (err) {
        console.warn('[backup] failed to read backupSettings, using defaults', err);
        return Object.assign({}, defaultSettings);
    }
}
function saveBackupSettings(next) {
    try {
        ensureDir(path_1.default.dirname(backupSettingsPath));
        fs_1.default.writeFileSync(backupSettingsPath, JSON.stringify(next, null, 2), 'utf8');
    }
    catch (err) {
        console.error('[backup] failed to persist backupSettings', err);
        throw err;
    }
}
router.get('/settings', (_req, res) => {
    const settings = loadBackupSettings();
    // Return the token as-is so the UI can reuse; consider masking in a real deployment
    return res.json({ ok: true, settings });
});
router.put('/settings', (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const body = req.body || {};
    const current = loadBackupSettings();
    const next = {
        localBackupPath: ((_b = (_a = body.localBackupPath) !== null && _a !== void 0 ? _a : current.localBackupPath) !== null && _b !== void 0 ? _b : defaultSettings.localBackupPath).trim(),
        r2AccountId: ((_d = (_c = body.r2AccountId) !== null && _c !== void 0 ? _c : current.r2AccountId) !== null && _d !== void 0 ? _d : '').trim(),
        r2ApiToken: ((_f = (_e = body.r2ApiToken) !== null && _e !== void 0 ? _e : current.r2ApiToken) !== null && _f !== void 0 ? _f : '').trim(),
        r2Bucket: ((_h = (_g = body.r2Bucket) !== null && _g !== void 0 ? _g : current.r2Bucket) !== null && _h !== void 0 ? _h : '').trim(),
        r2Prefix: ((_k = (_j = body.r2Prefix) !== null && _j !== void 0 ? _j : current.r2Prefix) !== null && _k !== void 0 ? _k : '').trim(),
    };
    saveBackupSettings(next);
    return res.json({ ok: true, settings: next });
});
function uploadToR2(_a) {
    return __awaiter(this, arguments, void 0, function* ({ json, accountId, apiToken, bucket, prefix, fileName, }) {
        const objectKey = prefix ? `${prefix}/${fileName}` : fileName;
        const encodedKey = objectKey.split('/').map(part => encodeURIComponent(part)).join('/');
        const options = {
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
        yield new Promise((resolve, reject) => {
            const uploadReq = https_1.default.request(options, (uploadRes) => {
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
    });
}
router.post('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const incoming = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.r2Config) || {};
        const stored = loadBackupSettings();
        const rawAccountId = ((_c = (_b = incoming.accountId) !== null && _b !== void 0 ? _b : stored.r2AccountId) !== null && _c !== void 0 ? _c : '').trim();
        const rawBucket = ((_e = (_d = incoming.bucket) !== null && _d !== void 0 ? _d : stored.r2Bucket) !== null && _e !== void 0 ? _e : '').trim();
        const apiToken = ((_g = (_f = incoming.apiToken) !== null && _f !== void 0 ? _f : stored.r2ApiToken) !== null && _g !== void 0 ? _g : '').trim();
        const userPrefix = ((_j = (_h = incoming.prefix) !== null && _h !== void 0 ? _h : stored.r2Prefix) !== null && _j !== void 0 ? _j : '').trim();
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
        yield uploadToR2({ json, accountId, apiToken, bucket, prefix: normalizedPrefix, fileName });
        return res.json({ ok: true, message: `R2 test object uploaded to ${bucket}/${normalizedPrefix ? normalizedPrefix + '/' : ''}${fileName}` });
    }
    catch (err) {
        console.error('[backup] R2 test failed', err);
        return res.status(500).json({ ok: false, error: 'R2 connection test failed', detail: String((err === null || err === void 0 ? void 0 : err.message) || err) });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { location, localPath, r2Config } = req.body;
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
        const filePath = path_1.default.join(targetDir, fileName);
        console.log('[backup] writing to:', filePath);
        const users = safeReadJson(path_1.default.join(repoRoot, 'server', 'data', 'users.json'));
        const sessions = safeReadJson(path_1.default.join(repoRoot, 'server', 'data', 'sessions.json'));
        const payload = {
            createdAt: timestamp.toISOString(),
            location: loc,
            note: 'Local demo backup generated by admin Run Now.',
            includes: {
                users: Array.isArray(users) ? users.length : ((_b = (_a = users === null || users === void 0 ? void 0 : users.users) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0),
                sessions: Array.isArray(sessions) ? sessions.length : 0,
            },
            data: {
                users,
                sessions,
            },
        };
        const json = JSON.stringify(payload, null, 2);
        console.log('[backup] about to write', Buffer.byteLength(json, 'utf8'), 'bytes to:', filePath);
        fs_1.default.writeFileSync(filePath, json, 'utf8');
        console.log('[backup] writeFileSync completed');
        // Verify the file was actually written before claiming success
        const exists = fs_1.default.existsSync(filePath);
        const stat = exists ? fs_1.default.statSync(filePath) : null;
        console.log('[backup] file existence check:', { exists, filePath, statSize: stat === null || stat === void 0 ? void 0 : stat.size });
        if (!exists) {
            throw new Error(`File was not written or not found after write: ${filePath}`);
        }
        const sizeBytes = Buffer.byteLength(json, 'utf8');
        console.log('[backup] saved', { filePath, sizeBytes, statSize: stat === null || stat === void 0 ? void 0 : stat.size, fileExists: exists });
        let detail = `Saved backup locally: ${filePath} (${(sizeBytes / (1024 * 1024)).toFixed(2)} MB)`;
        let r2Uploaded = false;
        if (loc === 'cloud' || loc === 'both') {
            const rawAccountId = ((_d = (_c = r2Config === null || r2Config === void 0 ? void 0 : r2Config.accountId) !== null && _c !== void 0 ? _c : storedSettings.r2AccountId) !== null && _d !== void 0 ? _d : '').trim();
            const rawBucket = ((_f = (_e = r2Config === null || r2Config === void 0 ? void 0 : r2Config.bucket) !== null && _e !== void 0 ? _e : storedSettings.r2Bucket) !== null && _f !== void 0 ? _f : '').trim();
            const apiToken = ((_h = (_g = r2Config === null || r2Config === void 0 ? void 0 : r2Config.apiToken) !== null && _g !== void 0 ? _g : storedSettings.r2ApiToken) !== null && _h !== void 0 ? _h : '').trim();
            const userPrefix = ((_k = (_j = r2Config === null || r2Config === void 0 ? void 0 : r2Config.prefix) !== null && _j !== void 0 ? _j : storedSettings.r2Prefix) !== null && _k !== void 0 ? _k : '').trim();
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
            yield uploadToR2({ json, accountId, apiToken, bucket, prefix: normalizedPrefix, fileName });
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
    }
    catch (err) {
        console.error('[backup] failed to write backup', err);
        return res.status(500).json({ ok: false, error: 'Failed to write backup file', detail: String((err === null || err === void 0 ? void 0 : err.message) || err) });
    }
}));
exports.default = router;
