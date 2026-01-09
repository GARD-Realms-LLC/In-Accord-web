"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
function readLocalUsers() {
    try {
        const dataPath = path_1.default.resolve(__dirname, '..', '..', 'data', 'users.json');
        if (fs_1.default.existsSync(dataPath)) {
            const raw = fs_1.default.readFileSync(dataPath, 'utf8');
            const parsed = JSON.parse(raw);
            const dataUsers = Array.isArray(parsed.users) ? parsed.users : Array.isArray(parsed) ? parsed : [];
            // Merge with seed users so seed metadata (name/email/username) remains available
            try {
                const seed = path_1.default.resolve(__dirname, '..', '..', 'prisma', 'seedData', 'users.json');
                if (fs_1.default.existsSync(seed)) {
                    const rawSeed = fs_1.default.readFileSync(seed, 'utf8');
                    const seedUsers = JSON.parse(rawSeed);
                    const map = new Map();
                    const keyOf = (u) => (u.userId || u.id || (u.email || '').toLowerCase() || '');
                    // put seed users first
                    for (const s of seedUsers || [])
                        map.set(keyOf(s), Object.assign({}, s));
                    // overlay data users (so password and overrides persist)
                    for (const d of dataUsers || []) {
                        const k = keyOf(d);
                        const existing = map.get(k) || {};
                        map.set(k, Object.assign(Object.assign({}, existing), d));
                    }
                    return Array.from(map.values());
                }
            }
            catch (e) {
                // if seed read fails, just return dataUsers
                return dataUsers;
            }
            return dataUsers;
        }
    }
    catch (e) {
        console.warn('[Auth] readLocalUsers error', e);
    }
    // fallback to seedData
    try {
        const seed = path_1.default.resolve(__dirname, '..', '..', 'prisma', 'seedData', 'users.json');
        if (fs_1.default.existsSync(seed)) {
            const raw = fs_1.default.readFileSync(seed, 'utf8');
            return JSON.parse(raw);
        }
    }
    catch (e) {
        console.warn('[Auth] readSeedUsers error', e);
    }
    return [];
}
// POST /login { username }
router.post('/login', (req, res) => {
    const { username, password, passwordHash } = req.body;
    if (!username || typeof username !== 'string')
        return res.status(400).json({ ok: false, error: 'username required' });
    const users = readLocalUsers();
    const lower = username.toLowerCase();
    const found = users.find((u) => {
        if (!u)
            return false;
        if ((u.username || '').toLowerCase() === lower)
            return true;
        if ((u.email || '').split('@')[0].toLowerCase() === lower)
            return true;
        if ((u.name || '').toLowerCase() === lower)
            return true;
        return false;
    });
    if (!found)
        return res.status(404).json({ ok: false, error: 'user not found' });
    // check password
    const stored = (found.password || found.pass || '');
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
                    const derived = crypto_1.default.pbkdf2Sync(password, salt, iterations, Buffer.from(hash, 'hex').length, 'sha256').toString('hex');
                    ok = derived === hash;
                }
                else if (typeof passwordHash === 'string') {
                    // if client sent sha256 hex, compare by hashing that? unlikely - reject
                    ok = false;
                }
            }
        }
        else if (stored.startsWith('sha256$')) {
            const hex = stored.split('$')[1] || '';
            if (typeof password === 'string') {
                const derived = crypto_1.default.createHash('sha256').update(password).digest('hex');
                ok = derived === hex;
            }
            else if (typeof passwordHash === 'string') {
                ok = passwordHash === hex;
            }
        }
        else if (/^[0-9a-f]{64}$/i.test(stored)) {
            // legacy sha256 stored directly
            const hex = stored;
            if (typeof password === 'string') {
                const derived = crypto_1.default.createHash('sha256').update(password).digest('hex');
                ok = derived === hex;
            }
            else if (typeof passwordHash === 'string') {
                ok = passwordHash === hex;
            }
        }
        else {
            // unknown format - reject unless passwordHash matches stored
            if (typeof passwordHash === 'string')
                ok = passwordHash === stored;
        }
        if (!ok)
            return res.status(403).json({ ok: false, error: 'invalid credentials' });
    }
    else {
        // no stored password - deny login
        return res.status(403).json({ ok: false, error: 'user has no password set' });
    }
    const user = { id: found.userId || found.id || found.id, name: found.name || found.fullName || '', email: found.email || '', username: (found.username || (found.email ? found.email.split('@')[0] : '')) };
    return res.json({ ok: true, user });
});
// POST /logout { sessionId }
router.post('/logout', (req, res) => {
    // stateless endpoint; client should call sessions terminate separately if desired
    return res.json({ ok: true });
});
exports.default = router;
