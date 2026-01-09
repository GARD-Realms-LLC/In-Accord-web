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
const dataFile = path_1.default.resolve(__dirname, '..', '..', 'data', 'users.json');
function ensureDataFile() {
    try {
        const dir = path_1.default.dirname(dataFile);
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
        if (!fs_1.default.existsSync(dataFile))
            fs_1.default.writeFileSync(dataFile, JSON.stringify({ users: [] }, null, 2));
    }
    catch (e) {
        console.error('[UsersRoute] ensureDataFile error', e);
    }
}
function readUsersFile() {
    try {
        ensureDataFile();
        const raw = fs_1.default.readFileSync(dataFile, 'utf8');
        return JSON.parse(raw);
    }
    catch (e) {
        console.error('[UsersRoute] read error', e);
        return { users: [] };
    }
}
function writeUsersFile(obj) {
    try {
        ensureDataFile();
        fs_1.default.writeFileSync(dataFile, JSON.stringify(obj, null, 2), 'utf8');
        return true;
    }
    catch (e) {
        console.error('[UsersRoute] write error', e);
        return false;
    }
}
// GET all users (read-only)
router.get('/', (req, res) => {
    const data = readUsersFile();
    return res.json({ ok: true, users: data.users || [] });
});
// POST update password for a user: { id, passwordHash } OR { id, passwordPlain }
router.post('/password', (req, res) => {
    const { id, passwordHash, passwordPlain } = req.body;
    if (!id || typeof id !== 'string')
        return res.status(400).json({ ok: false, error: 'id required' });
    if (!passwordHash && !passwordPlain)
        return res.status(400).json({ ok: false, error: 'passwordHash or passwordPlain required' });
    const data = readUsersFile();
    const users = Array.isArray(data.users) ? data.users : [];
    const idx = users.findIndex((u) => u.id === id);
    let storeValue = '';
    if (passwordPlain) {
        // create PBKDF2 hash
        const salt = crypto_1.default.randomBytes(16).toString('hex');
        const iterations = 100000;
        const keyLen = 32;
        const digest = 'sha256';
        const derived = crypto_1.default.pbkdf2Sync(passwordPlain, salt, iterations, keyLen, digest).toString('hex');
        storeValue = `pbkdf2$${iterations}$${salt}$${derived}`;
    }
    else if (passwordHash && typeof passwordHash === 'string') {
        // store provided sha256 hash in clearable format
        if (/^[0-9a-f]{64}$/i.test(passwordHash)) {
            storeValue = `sha256$${passwordHash}`;
        }
        else {
            // unknown format - store as-is
            storeValue = passwordHash;
        }
    }
    if (idx === -1) {
        users.push({ id, password: storeValue });
    }
    else {
        users[idx] = Object.assign(Object.assign({}, users[idx]), { password: storeValue });
    }
    const ok = writeUsersFile({ users });
    if (!ok)
        return res.status(500).json({ ok: false, error: 'failed to write' });
    return res.json({ ok: true, id });
});
// POST upload avatar: { id, dataUrl }
router.post('/avatar', (req, res) => {
    const { id, dataUrl } = req.body;
    if (!id || !dataUrl || typeof id !== 'string' || typeof dataUrl !== 'string')
        return res.status(400).json({ ok: false, error: 'id and dataUrl are required' });
    try {
        const m = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
        if (!m)
            return res.status(400).json({ ok: false, error: 'invalid dataUrl' });
        const mime = m[1];
        const base64 = m[2];
        const ext = mime.split('/')[1] || 'png';
        const buf = Buffer.from(base64, 'base64');
        const dir = path_1.default.resolve(__dirname, '..', '..', 'data', 'avatars');
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
        const filename = `${id.replace(/[^a-z0-9_-]/gi, '')}-${Date.now()}.${ext}`;
        const filePath = path_1.default.join(dir, filename);
        fs_1.default.writeFileSync(filePath, buf);
        const urlPath = `/data/avatars/${filename}`;
        return res.json({ ok: true, url: urlPath });
    }
    catch (e) {
        console.error('[UsersRoute] avatar upload error', e);
        return res.status(500).json({ ok: false, error: 'failed to write avatar' });
    }
});
exports.default = router;
