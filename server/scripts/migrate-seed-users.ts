import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function ensureDir(d: string) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function backupFile(file: string) {
  if (!fs.existsSync(file)) return;
  const stat = fs.statSync(file);
  const ts = new Date(stat.mtime).toISOString().replace(/[:.]/g, '-');
  const bak = file + '.' + ts + '.bak';
  fs.copyFileSync(file, bak);
  console.log(`Backed up existing file to ${bak}`);
}

try {
  const repoRoot = path.resolve(__dirname, '..');
  // seed is under server/prisma/seedData in this repo
  const seedPath = path.resolve(repoRoot, 'prisma', 'seedData', 'users.json');
  // data directory lives under server/data
  const dataDir = path.resolve(repoRoot, 'data');
  const dataPath = path.join(dataDir, 'users.json');

  if (!fs.existsSync(seedPath)) {
    console.error('Seed file not found at', seedPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(seedPath, 'utf8');
  const seed = JSON.parse(raw) as any[];
  if (!Array.isArray(seed) || seed.length === 0) {
    console.error('Seed file does not contain an array of users.');
    process.exit(1);
  }

  ensureDir(dataDir);
  if (fs.existsSync(dataPath)) backupFile(dataPath);

  const users = seed.map((u: any) => {
    const id = u.userId || u.id || (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
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

  fs.writeFileSync(dataPath, JSON.stringify({ users }, null, 2), 'utf8');
  console.log(`Wrote ${users.length} users to ${dataPath}`);
  process.exit(0);
} catch (e) {
  console.error('Migration failed:', e);
  process.exit(2);
}
