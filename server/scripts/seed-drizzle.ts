import fs from 'fs';
import path from 'path';
import { db } from '../src/db';
import { users } from '../src/schema';

async function seedUsers() {
  const dataPath = path.resolve(__dirname, '..', 'data', 'users.json');
  if (!fs.existsSync(dataPath)) {
    console.warn('No users.json found at', dataPath);
    return;
  }
  const raw = fs.readFileSync(dataPath, 'utf8');
  let entries: any[] = [];
  try {
    entries = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse users.json', err);
    return;
  }

  for (const u of entries) {
    try {
      // Upsert-like behaviour: try insert, ignore on conflict
      await db.insert(users).values({
        userId: u.userId ?? u.id ?? String(u.id || Date.now()),
        name: u.name ?? u.displayName ?? '',
        email: u.email ?? '',
        website: u.website ?? null,
        githubLogin: u.githubLogin ?? null,
        discordLogin: u.discordLogin ?? null,
        description: u.description ?? null,
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
      }).onConflictDoNothing();
    } catch (e) {
      console.warn('Failed inserting user', u, e?.message ?? e);
    }
  }
  console.log('Seed complete: users (attempted)', entries.length);
}

if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed', err);
      process.exit(1);
    });
}

export { seedUsers };
