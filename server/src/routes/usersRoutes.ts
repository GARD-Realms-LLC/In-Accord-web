import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  getAllowedRoutesForRole,
  getRouteAccessMap,
  normalizeRole,
  getDefaultRole,
} from '../config/accessControl';

const router = Router();
const dataFile = path.resolve(__dirname, '..', '..', 'data', 'users.json');

function ensureDataFile() {
  try {
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ users: [] }, null, 2));
  } catch (e) {
    console.error('[UsersRoute] ensureDataFile error', e);
  }
}

function readUsersFile() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[UsersRoute] read error', e);
    return { users: [] };
  }
}

function writeUsersFile(obj: any) {
  try {
    ensureDataFile();
    fs.writeFileSync(dataFile, JSON.stringify(obj, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('[UsersRoute] write error', e);
    return false;
  }
}

// GET all users (read-only)
router.get('/', (_req: Request, res: Response) => {
  const data = readUsersFile();
  const users = (Array.isArray(data.users) ? data.users : []).map((user: any) => {
    const normalizedRole = normalizeRole(user?.role || getDefaultRole());
    return {
      ...user,
      role: normalizedRole,
      allowedRoutes: getAllowedRoutesForRole(normalizedRole),
      permissions: getRouteAccessMap(normalizedRole),
    };
  });
  return res.json({ ok: true, users });
});

// POST update password for a user: { id, passwordHash } OR { id, passwordPlain }
router.post('/password', (req: Request, res: Response) => {
  const { id, passwordHash, passwordPlain } = req.body;
  if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'id required' });
  if (!passwordHash && !passwordPlain) return res.status(400).json({ ok: false, error: 'passwordHash or passwordPlain required' });
  const data = readUsersFile();
  const users = Array.isArray(data.users) ? data.users : [];
  const idx = users.findIndex((u: any) => u.id === id);

  let storeValue = '';
  if (passwordPlain) {
    // create PBKDF2 hash
    const salt = crypto.randomBytes(16).toString('hex');
    const iterations = 100000;
    const keyLen = 32;
    const digest = 'sha256';
    const derived = crypto.pbkdf2Sync(passwordPlain, salt, iterations, keyLen, digest).toString('hex');
    storeValue = `pbkdf2$${iterations}$${salt}$${derived}`;
  } else if (passwordHash && typeof passwordHash === 'string') {
    // store provided sha256 hash in clearable format
    if (/^[0-9a-f]{64}$/i.test(passwordHash)) {
      storeValue = `sha256$${passwordHash}`;
    } else {
      // unknown format - store as-is
      storeValue = passwordHash;
    }
  }

  if (idx === -1) {
    users.push({ id, password: storeValue });
  } else {
    users[idx] = { ...users[idx], password: storeValue };
  }
  const ok = writeUsersFile({ users });
  if (!ok) return res.status(500).json({ ok: false, error: 'failed to write' });
  return res.json({ ok: true, id });
});

// POST upsert full user record: { user }
router.post('/upsert', (req: Request, res: Response) => {
  const { user } = req.body;
  if (!user || typeof user !== 'object') return res.status(400).json({ ok: false, error: 'user required' });
  try {
    const data = readUsersFile();
    const users = Array.isArray(data.users) ? data.users : [];
    const id = user.id || user.userId || (user.email ? (user.email.split('@')[0]) : undefined) || ('u' + Math.random().toString(36).slice(2,9));
    const idx = users.findIndex((u: any) => (u.id === id) || (u.userId === id));

    const existing = idx !== -1 ? users[idx] : undefined;

    // start with existing user (if any) so we don't drop fields like password
    let toStore = { ...existing, ...user, id, userId: user.userId || user.id || id };

    // Set createdAt for new users
    if (idx === -1 && !toStore.createdAt) {
      toStore.createdAt = new Date().toISOString().split('T')[0];
    }

    // If password not provided, keep existing password
    if ((!user.password || user.password === '') && existing?.password) {
      toStore.password = existing.password;
    }

    // Hash password if provided as plain text
    if (user.password && typeof user.password === 'string' && !user.password.startsWith('pbkdf2$') && !user.password.startsWith('sha256$')) {
      const salt = crypto.randomBytes(16).toString('hex');
      const iterations = 100000;
      const keyLen = 32;
      const digest = 'sha256';
      const derived = crypto.pbkdf2Sync(user.password, salt, iterations, keyLen, digest).toString('hex');
      toStore.password = `pbkdf2$${iterations}$${salt}$${derived}`;
    }

    if (idx === -1) {
      users.push(toStore);
    } else {
      users[idx] = { ...users[idx], ...toStore };
    }
    const ok = writeUsersFile({ users });
    if (!ok) return res.status(500).json({ ok: false, error: 'failed to write' });

    const normalizedRole = normalizeRole(toStore.role || getDefaultRole());
    const responseUser = {
      ...toStore,
      role: normalizedRole,
      allowedRoutes: getAllowedRoutesForRole(normalizedRole),
      permissions: getRouteAccessMap(normalizedRole),
    };

    return res.json({ ok: true, user: responseUser });
  } catch (e) {
    console.error('[UsersRoute] upsert error', e);
    return res.status(500).json({ ok: false, error: 'internal' });
  }
});

// POST upload avatar: { id, dataUrl }
router.post('/avatar', (req: Request, res: Response) => {
  const { id, dataUrl } = req.body;
  if (!id || !dataUrl || typeof id !== 'string' || typeof dataUrl !== 'string') return res.status(400).json({ ok: false, error: 'id and dataUrl are required' });
  try {
    const m = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!m) return res.status(400).json({ ok: false, error: 'invalid dataUrl' });
    const mime = m[1];
    const base64 = m[2];
    const ext = mime.split('/')[1] || 'png';
    const buf = Buffer.from(base64, 'base64');
    const dir = path.resolve(__dirname, '..', '..', 'data', 'avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filename = `${id.replace(/[^a-z0-9_-]/gi, '')}-${Date.now()}.${ext}`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, buf);
    // Return full URL with backend server origin
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const urlPath = `${backendUrl}/data/avatars/${filename}`;
    return res.json({ ok: true, url: urlPath });
  } catch (e) {
    console.error('[UsersRoute] avatar upload error', e);
    return res.status(500).json({ ok: false, error: 'failed to write avatar' });
  }
});

// DELETE user account
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'id required' });
  try {
    const data = readUsersFile();
    const users = Array.isArray(data.users) ? data.users : [];
    const idx = users.findIndex((u: any) => (u.id === id) || (u.userId === id));
    
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'user not found' });
    }
    
    // Remove user from array
    users.splice(idx, 1);
    
    const ok = writeUsersFile({ users });
    if (!ok) return res.status(500).json({ ok: false, error: 'failed to delete' });
    
    return res.json({ ok: true, message: 'account deleted' });
  } catch (e) {
    console.error('[UsersRoute] delete error', e);
    return res.status(500).json({ ok: false, error: 'internal' });
  }
});

export default router;
