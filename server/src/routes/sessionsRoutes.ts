import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { safeReadJsonSync } from '../lib/safeJson';

const router = Router();

interface SessionUser { id?: string; name?: string; email?: string; username?: string }
interface SessionRecord { id: string; userId?: string; ip: string; since: string; user?: SessionUser; avatar?: string }

const sessionsFile = path.resolve(__dirname, '..', '..', 'data', 'sessions.json');

function ensureSessionsFile() {
  try {
    const dir = path.dirname(sessionsFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(sessionsFile)) fs.writeFileSync(sessionsFile, JSON.stringify({ sessions: [] }, null, 2));
  } catch (e) {
    console.warn('[Sessions] ensure file error', e);
  }
}

function readSessions(): SessionRecord[] {
  try {
    ensureSessionsFile();
    const parsed = safeReadJsonSync(sessionsFile, { sessions: [] });
    if (!parsed) return [];
    return Array.isArray(parsed.sessions) ? parsed.sessions : Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[Sessions] read error', e);
    return [];
  }
}

function writeSessions(list: SessionRecord[]) {
  try {
    ensureSessionsFile();
    fs.writeFileSync(sessionsFile, JSON.stringify({ sessions: list }, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Sessions] write error', e);
  }
}

let sessions: SessionRecord[] = readSessions();

// GET / - list sessions
router.get('/', (req: Request, res: Response) => {
  sessions = readSessions();
  return res.json({ ok: true, sessions });
});

// POST /terminate { sessionId }
router.post('/terminate', (req: Request, res: Response) => {
  const { sessionId } = req.body;
  if (!sessionId || typeof sessionId !== 'string') return res.status(400).json({ ok: false, error: 'sessionId required' });
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'not found' });
  const removed = sessions.splice(idx, 1)[0];
  writeSessions(sessions);
  return res.json({ ok: true, removed });
});

// POST /create { user: { id?, name?, email?, username? } }
router.post('/create', (req: Request, res: Response) => {
  const { user } = req.body;
  if (!user || typeof user !== 'object') return res.status(400).json({ ok: false, error: 'user required' });
  const id = 'sess-' + (user.userId || user.id || Math.random().toString(36).slice(2,9));
  const rec: SessionRecord = { id, userId: user.userId || user.id || undefined, ip: req.ip || '0.0.0.0', since: new Date().toISOString(), user: { id: user.userId || user.id, name: user.name, email: user.email, username: user.username } };
  sessions.push(rec);
  writeSessions(sessions);
  return res.json({ ok: true, session: rec });
});

// POST /terminate-all
router.post('/terminate-all', (_req: Request, res: Response) => {
  const count = sessions.length;
  sessions.splice(0, sessions.length);
  writeSessions(sessions);
  return res.json({ ok: true, terminated: count });
});

// POST /update-avatar { sessionId, avatar }
router.post('/update-avatar', (req: Request, res: Response) => {
  const { sessionId, avatar } = req.body;
  if (!sessionId || typeof sessionId !== 'string') return res.status(400).json({ ok: false, error: 'sessionId required' });
  if (!avatar || typeof avatar !== 'string') return res.status(400).json({ ok: false, error: 'avatar required' });
  
  sessions = readSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return res.status(404).json({ ok: false, error: 'session not found' });
  
  session.avatar = avatar;
  writeSessions(sessions);
  return res.json({ ok: true, session });
});

export default router;
