Portable copy & run checklist for In-Accord-web
Date: 2026-01-20

Purpose
-------
Step-by-step checklist and quick commands to copy this repository to another host and run it reliably. Includes recommended Docker option and minimal troubleshooting tips.

Minimum checklist
-----------------
1) Copy repository
   - git clone <repo-url> or copy full workspace (include `client/`, `server/`, `data/`, `prisma/` if present).

2) Match Node & tooling
   - Use the same Node version (use nvm or host package manager).
     Example: nvm install 18 && nvm use 18

3) Environment variables
   - Create `.env` files required by the project (root, and `client/` or `server/` if needed).
   - Common keys to verify in code: DATABASE_URL, NEXT_PUBLIC_API_BASE_URL, PORT, NEXT_PUBLIC_SOCKET_URL, JWT_SECRET, SMTP_*, etc.
   - Add an `.env.example` listing keys for future moves.

4) Install deps reproducibly
   - Prefer npm ci for exact installs:
     npm ci
   - If monorepo with `client/` and `server/`, run inside each package:
     cd client && npm ci
     cd ../server && npm ci

5) Database & data
   - Ensure the target runs the same DB engine and is reachable.
   - Create DB, run migrations, and seed data using the project’s documented commands.
   - If your project uses codegen/generators, run them (e.g., Prisma: npx prisma generate).

6) Static files & uploads
   - Copy `server/data`, `client/public`, and any upload directories or configure remote storage.

7) Build & run
   - Frontend (Next.js):
     cd client
     npm run build
     npm run start
   - Backend:
     cd server
     npm run build
     npm run start
   - For development: use the repo’s dev scripts (npm run dev)

8) Ports, proxy, firewall
   - Open required ports or configure reverse proxy (nginx) to forward to app ports.

9) Runtime services
   - Ensure external services (DB, Redis, SMTP, OAuth providers) are running and accessible.

10) OS specifics
   - Rebuild native modules if host OS differs (npm rebuild). Watch for case-sensitivity and path issues.

11) Logs & troubleshooting
   - Tail logs on the server and check browser console for CORS/missing asset errors.

Quick copy-and-run (example)
----------------------------
```bash
git clone <repo>
cd <repo>

# node version (example)
nvm install 18
nvm use 18

# client
cd client
npm ci
npm run build
npm run start &

# server
cd ../server
npm ci
# ensure .env present
npm run start
```

Recommended: Docker (recommended for portability)
-------------------------------------------------
- A Dockerfile + docker-compose bundles exact Node version, environment, and services so the app runs the same everywhere.
- I can create:
  - Dockerfile for `client/` and `server/`
  - docker-compose.yml to run Postgres + server + client
  - `.env.example` and README with commands

What I can produce next (pick one)
----------------------------------
- MAKE DOCKER — Create Dockerfiles and docker-compose for the repo.
- PROJECT CHECKLIST — Create a tailored checklist listing exact env keys and commands for this repo.

Saved to: e:\In-Accord-web\COPY_SETUP.md

If you'd like me to generate Docker files or a repo-specific `.env.example`, reply with "MAKE DOCKER" or "PROJECT CHECKLIST" and I will create them in the workspace.
