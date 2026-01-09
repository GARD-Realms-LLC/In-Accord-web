import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

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
router.get('/', (req: Request, res: Response) => {
  const data = readUsersFile();
  return res.json({ ok: true, users: data.users || [] });
});

// POST update password for a user: { id, passwordHash }
router.post('/password', (req: Request, res: Response) => {
  const { id, passwordHash } = req.body;
  if (!id || !passwordHash || typeof id !== 'string' || typeof passwordHash !== 'string') return res.status(400).json({ ok: false, error: 'id and passwordHash are required' });
  const data = readUsersFile();
  const users = Array.isArray(data.users) ? data.users : [];
  const idx = users.findIndex((u: any) => u.id === id);
  if (idx === -1) {
    // if user not found, append new minimal record
    users.push({ id, password: passwordHash });
  } else {
    users[idx] = { ...users[idx], password: passwordHash };
  }
  const ok = writeUsersFile({ users });
  if (!ok) return res.status(500).json({ ok: false, error: 'failed to write' });
  return res.json({ ok: true, id });
});

export default router;
