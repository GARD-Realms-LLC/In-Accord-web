"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const safeJson_1 = require("../lib/safeJson");
const crypto_1 = __importDefault(require("crypto"));
const accessControl_1 = require("../config/accessControl");
const router = (0, express_1.Router)();
function readLocalUsers() {
    try {
        const dataPath = path_1.default.resolve(__dirname, '..', '..', 'data', 'users.json');
        if (fs_1.default.existsSync(dataPath)) {
            const parsed = (0, safeJson_1.safeReadJsonSync)(dataPath, { users: [] });
            const dataUsers = Array.isArray(parsed.users) ? parsed.users : Array.isArray(parsed) ? parsed : [];
            return dataUsers;
        }
    }
    catch (e) {
        console.warn('[Auth] readLocalUsers error', e);
    }
    // Do not fall back to seed data: prefer real users only
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
        // match by id/userId as a fallback for minimal user records
        if ((u.id || '').toLowerCase() === lower)
            return true;
        if ((u.userId || '').toLowerCase() === lower)
            return true;
        if ((u.username || '').toLowerCase() === lower)
            return true;
        const email = (u.email || '').toLowerCase();
        // match full email (user@example.com) or local-part (user)
        if (email === lower)
            return true;
        const local = email.split('@')[0] || '';
        if (local === lower)
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
    const normalizedRole = (0, accessControl_1.normalizeRole)(found.role || (0, accessControl_1.getDefaultRole)());
    const allowedRoutes = (0, accessControl_1.getAllowedRoutesForRole)(normalizedRole);
    const permissions = (0, accessControl_1.getRouteAccessMap)(normalizedRole);
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
router.post('/logout', (req, res) => {
    // stateless endpoint; client should call sessions terminate separately if desired
    return res.json({ ok: true });
});
exports.default = router;
// GET /whois?username=<username|email>
router.get('/whois', (req, res) => {
    const username = (req.query.username || '');
    if (!username || typeof username !== 'string')
        return res.status(400).json({ ok: false, error: 'username required' });
    const users = readLocalUsers();
    const lower = username.toLowerCase();
    const found = users.find((u) => {
        if (!u)
            return false;
        if ((u.username || '').toLowerCase() === lower)
            return true;
        const email = (u.email || '').toLowerCase();
        if (email === lower)
            return true;
        const local = email.split('@')[0] || '';
        if (local === lower)
            return true;
        if ((u.name || '').toLowerCase() === lower)
            return true;
        return false;
    });
    if (!found)
        return res.status(404).json({ ok: false, error: 'user not found' });
    const normalizedRole = (0, accessControl_1.normalizeRole)(found.role || (0, accessControl_1.getDefaultRole)());
    const allowedRoutes = (0, accessControl_1.getAllowedRoutesForRole)(normalizedRole);
    const permissions = (0, accessControl_1.getRouteAccessMap)(normalizedRole);
    return res.json({
        ok: true,
        user: Object.assign(Object.assign({}, found), { role: normalizedRole, allowedRoutes,
            permissions }),
    });
});
