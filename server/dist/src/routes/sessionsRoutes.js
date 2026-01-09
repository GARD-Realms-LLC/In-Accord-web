"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const sessions = [];
function seedSessions() {
    try {
        const file = path_1.default.resolve(__dirname, '..', '..', 'prisma', 'seedData', 'users.json');
        if (!fs_1.default.existsSync(file))
            return;
        const raw = fs_1.default.readFileSync(file, 'utf8');
        const users = JSON.parse(raw);
        // pick up to 6 random users
        const sample = users.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 6);
        sample.forEach((u, idx) => {
            const id = 'sess-' + (u.userId || Math.random().toString(36).slice(2, 9));
            sessions.push({ id, userId: u.userId || undefined, ip: `10.0.0.${100 + idx}`, since: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString(), user: { id: u.userId, name: u.name, email: u.email } });
        });
    }
    catch (e) {
        console.warn('[Sessions] seed failed', e);
    }
}
seedSessions();
// GET / - list sessions
router.get('/', (req, res) => {
    return res.json({ ok: true, sessions });
});
// POST /terminate { sessionId }
router.post('/terminate', (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId || typeof sessionId !== 'string')
        return res.status(400).json({ ok: false, error: 'sessionId required' });
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1)
        return res.status(404).json({ ok: false, error: 'not found' });
    const removed = sessions.splice(idx, 1)[0];
    return res.json({ ok: true, removed });
});
// POST /create { user: { id?, name?, email?, username? } }
router.post('/create', (req, res) => {
    const { user } = req.body;
    if (!user || typeof user !== 'object')
        return res.status(400).json({ ok: false, error: 'user required' });
    const id = 'sess-' + (user.userId || user.id || Math.random().toString(36).slice(2, 9));
    const rec = { id, userId: user.userId || user.id || undefined, ip: req.ip || '0.0.0.0', since: new Date().toISOString(), user: { id: user.userId || user.id, name: user.name, email: user.email, username: user.username } };
    sessions.push(rec);
    return res.json({ ok: true, session: rec });
});
// POST /terminate-all
router.post('/terminate-all', (_req, res) => {
    const count = sessions.length;
    sessions.splice(0, sessions.length);
    return res.json({ ok: true, terminated: count });
});
exports.default = router;
