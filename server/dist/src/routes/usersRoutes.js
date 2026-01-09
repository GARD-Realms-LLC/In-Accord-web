"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
// POST update password for a user: { id, passwordHash }
router.post('/password', (req, res) => {
    const { id, passwordHash } = req.body;
    if (!id || !passwordHash || typeof id !== 'string' || typeof passwordHash !== 'string')
        return res.status(400).json({ ok: false, error: 'id and passwordHash are required' });
    const data = readUsersFile();
    const users = Array.isArray(data.users) ? data.users : [];
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
        // if user not found, append new minimal record
        users.push({ id, password: passwordHash });
    }
    else {
        users[idx] = Object.assign(Object.assign({}, users[idx]), { password: passwordHash });
    }
    const ok = writeUsersFile({ users });
    if (!ok)
        return res.status(500).json({ ok: false, error: 'failed to write' });
    return res.json({ ok: true, id });
});
exports.default = router;
