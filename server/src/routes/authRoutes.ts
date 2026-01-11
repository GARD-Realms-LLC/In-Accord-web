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

function readLocalUsers() {
  try {
    const dataPath = path.resolve(__dirname, '..', '..', 'data', 'users.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf8');
      const parsed = JSON.parse(raw);
      const dataUsers = Array.isArray(parsed.users) ? parsed.users : Array.isArray(parsed) ? parsed : [];
      return dataUsers;
    }
  } catch (e) { console.warn('[Auth] readLocalUsers error', e); }
  // Do not fall back to seed data: prefer real users only
  return [];
}

// POST /login { username }
router.post('/login', (req: Request, res: Response) => {
  const { username, password, passwordHash } = req.body;
  if (!username || typeof username !== 'string') return res.status(400).json({ ok: false, error: 'username required' });
  const users = readLocalUsers();
  const lower = username.toLowerCase();
  const found = users.find((u: any) => {
    if (!u) return false;
    // match by id/userId as a fallback for minimal user records
    if ((u.id || '').toLowerCase() === lower) return true;
    if ((u.userId || '').toLowerCase() === lower) return true;
    if ((u.username || '').toLowerCase() === lower) return true;
    const email = (u.email || '').toLowerCase();
    // match full email (user@example.com) or local-part (user)
    if (email === lower) return true;
    const local = email.split('@')[0] || '';
    if (local === lower) return true;
    if ((u.name || '').toLowerCase() === lower) return true;
    return false;
  });
  if (!found) return res.status(404).json({ ok: false, error: 'user not found' });

  // check password
  const stored = (found.password || found.pass || '') as string;
  const hasStored = typeof stored === 'string' && stored.length > 0;
  if (hasStored) {
    let ok = false;
    if (stored.startsWith('pbkdf2$')) {
      const parts = stored.split('$');
      // pbkdf2$iterations$salt$hash
      if (parts.length === 4) {
        const iterations = parseInt(parts[1], 10) || 100000;
        const salt = parts[2];
        const hash = parts[3];
        if (typeof password === 'string') {
          const derived = crypto.pbkdf2Sync(password, salt, iterations, Buffer.from(hash, 'hex').length, 'sha256').toString('hex');
          ok = derived === hash;
        } else if (typeof passwordHash === 'string') {
          // if client sent sha256 hex, compare by hashing that? unlikely - reject
          ok = false;
        }
      }
    } else if (stored.startsWith('sha256$')) {
      const hex = stored.split('$')[1] || '';
      if (typeof password === 'string') {
        const derived = crypto.createHash('sha256').update(password).digest('hex');
        ok = derived === hex;
      } else if (typeof passwordHash === 'string') {
        ok = passwordHash === hex;
      }
    } else if (/^[0-9a-f]{64}$/i.test(stored)) {
      // legacy sha256 stored directly
      const hex = stored;
      if (typeof password === 'string') {
        const derived = crypto.createHash('sha256').update(password).digest('hex');
        ok = derived === hex;
      } else if (typeof passwordHash === 'string') {
        ok = passwordHash === hex;
      }
    } else {
      // unknown format - reject unless passwordHash matches stored
      if (typeof passwordHash === 'string') ok = passwordHash === stored;
    }

    if (!ok) return res.status(403).json({ ok: false, error: 'invalid credentials' });
  } else {
    // no stored password - deny login
    return res.status(403).json({ ok: false, error: 'user has no password set' });
  }

  const normalizedRole = normalizeRole(found.role || getDefaultRole());
  const allowedRoutes = getAllowedRoutesForRole(normalizedRole);
  const permissions = getRouteAccessMap(normalizedRole);

  const user = {
    id: found.userId || found.id || found.id,
    userId: found.userId || found.id,
    name: found.name || found.fullName || '',
    email: found.email || '',
    username: found.username || (found.email ? found.email.split('@')[0] : ''),
    role: normalizedRole,
    avatarUrl: found.avatarUrl || found.avatar,
    allowedRoutes,
    permissions,
  };
  return res.json({ ok: true, user });
});

// POST /logout { sessionId }
router.post('/logout', (req: Request, res: Response) => {
  // stateless endpoint; client should call sessions terminate separately if desired
  return res.json({ ok: true });
});

export default router;

// GET /whois?username=<username|email>
router.get('/whois', (req: Request, res: Response) => {
  const username = (req.query.username || '') as string;
  if (!username || typeof username !== 'string') return res.status(400).json({ ok: false, error: 'username required' });
  const users = readLocalUsers();
  const lower = username.toLowerCase();
  const found = users.find((u: any) => {
    if (!u) return false;
    if ((u.username || '').toLowerCase() === lower) return true;
    const email = (u.email || '').toLowerCase();
    if (email === lower) return true;
    const local = email.split('@')[0] || '';
    if (local === lower) return true;
    if ((u.name || '').toLowerCase() === lower) return true;
    return false;
  });
  if (!found) return res.status(404).json({ ok: false, error: 'user not found' });
  const normalizedRole = normalizeRole(found.role || getDefaultRole());
  const allowedRoutes = getAllowedRoutesForRole(normalizedRole);
  const permissions = getRouteAccessMap(normalizedRole);
  return res.json({
    ok: true,
    user: {
      ...found,
      role: normalizedRole,
      allowedRoutes,
      permissions,
    },
  });
});
