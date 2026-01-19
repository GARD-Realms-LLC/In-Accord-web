"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
function ensureDir(d) {
    if (!fs_1.default.existsSync(d))
        fs_1.default.mkdirSync(d, { recursive: true });
}
function backupFile(file) {
    if (!fs_1.default.existsSync(file))
        return;
    const stat = fs_1.default.statSync(file);
    const ts = new Date(stat.mtime).toISOString().replace(/[:.]/g, '-');
    // place assistant-created backups in a dedicated folder at repo root
    const repoRoot = path_1.default.resolve(__dirname, '..');
    const ASSISTANT_BAK_DIR = path_1.default.resolve(repoRoot, '..', 'assistant_baks');
    ensureDir(ASSISTANT_BAK_DIR);
    const bak = path_1.default.join(ASSISTANT_BAK_DIR, path_1.default.basename(file) + '.' + ts + '.bak');
    fs_1.default.copyFileSync(file, bak);
    console.log(`Backed up existing file to ${bak}`);
}
try {
    const repoRoot = path_1.default.resolve(__dirname, '..');
    // seed is under server/prisma/seedData in this repo
    const seedPath = path_1.default.resolve(repoRoot, 'prisma', 'seedData', 'users.json');
    // data directory lives under server/data
    const dataDir = path_1.default.resolve(repoRoot, 'data');
    const dataPath = path_1.default.join(dataDir, 'users.json');
    if (!fs_1.default.existsSync(seedPath)) {
        console.error('Seed file not found at', seedPath);
        process.exit(1);
    }
    const raw = fs_1.default.readFileSync(seedPath, 'utf8');
    const seed = JSON.parse(raw);
    if (!Array.isArray(seed) || seed.length === 0) {
        console.error('Seed file does not contain an array of users.');
        process.exit(1);
    }
    ensureDir(dataDir);
    if (fs_1.default.existsSync(dataPath))
        backupFile(dataPath);
    const users = seed.map((u) => {
        const id = u.userId || u.id || (crypto_1.default.randomUUID ? crypto_1.default.randomUUID() : crypto_1.default.randomBytes(16).toString('hex'));
        const email = (u.email || '').toLowerCase();
        const username = u.username || (email ? email.split('@')[0] : undefined) || id;
        return {
            id,
            userId: id,
            name: u.name || u.fullName || '',
            email: u.email || '',
            username,
        };
    });
    fs_1.default.writeFileSync(dataPath, JSON.stringify({ users }, null, 2), 'utf8');
    console.log(`Wrote ${users.length} users to ${dataPath}`);
    process.exit(0);
}
catch (e) {
    console.error('Migration failed:', e);
    process.exit(2);
}
