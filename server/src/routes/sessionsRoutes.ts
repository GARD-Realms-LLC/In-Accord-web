import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

interface SessionUser { id?: string; name?: string; email?: string; username?: string }
interface SessionRecord { id: string; userId?: string; ip: string; since: string; user?: SessionUser; avatar?: string }

const sessions: SessionRecord[] = [];

function seedSessions() {
  try {
    const file = path.resolve(__dirname, '..', '..', 'data', 'users.json');
    if (!fs.existsSync(file)) return;
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    const users = Array.isArray(parsed.users) ? parsed.users : Array.isArray(parsed) ? parsed : [];
    // pick up to 6 random users
    const sample = users.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 6);
    sample.forEach((u: any, idx: number) => {
      const id = 'sess-' + (u.userId || Math.random().toString(36).slice(2,9));
      sessions.push({ id, userId: u.userId || undefined, ip: `10.0.0.${100 + idx}`, since: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString(), user: { id: u.userId, name: u.name, email: u.email } });
    });
  } catch (e) {
    console.warn('[Sessions] seed failed', e);
  }
}

// Do not auto-seed sessions on startup — show only real sessions created at runtime
// seedSessions();

// GET / - list sessions
router.get('/', (req: Request, res: Response) => {
  return res.json({ ok: true, sessions });
});

// POST /terminate { sessionId }
router.post('/terminate', (req: Request, res: Response) => {
  const { sessionId } = req.body;
  if (!sessionId || typeof sessionId !== 'string') return res.status(400).json({ ok: false, error: 'sessionId required' });
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'not found' });
  const removed = sessions.splice(idx, 1)[0];
  return res.json({ ok: true, removed });
});

// POST /create { user: { id?, name?, email?, username? } }
router.post('/create', (req: Request, res: Response) => {
  const { user } = req.body;
  if (!user || typeof user !== 'object') return res.status(400).json({ ok: false, error: 'user required' });
  const id = 'sess-' + (user.userId || user.id || Math.random().toString(36).slice(2,9));
  const rec: SessionRecord = { id, userId: user.userId || user.id || undefined, ip: req.ip || '0.0.0.0', since: new Date().toISOString(), user: { id: user.userId || user.id, name: user.name, email: user.email, username: user.username } };
  sessions.push(rec);
  return res.json({ ok: true, session: rec });
});

// POST /terminate-all
router.post('/terminate-all', (_req: Request, res: Response) => {
  const count = sessions.length;
  sessions.splice(0, sessions.length);
  return res.json({ ok: true, terminated: count });
});

export default router;
