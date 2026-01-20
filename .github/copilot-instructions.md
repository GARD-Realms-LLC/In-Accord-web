<!-- Copilot / AI agent instructions for In-Accord-web -->

# Purpose
This file gives concise, actionable guidance to AI coding agents working on this repository so they can be productive immediately.

## Big picture
- Monorepo-like layout: frontend in `client/` (Next.js 13 app-router + Tailwind + MUI), backend in `server/` (Express + TypeScript + Prisma). Root package.json forwards to client app commands.
- Frontend and backend are independent processes; frontend runs with `client` Next dev server, backend is an Express server on port 8000 by default.

## Key entry points & examples
- Frontend root layout and app router: `client/src/app/layout.tsx` and `client/src/app/*` (pages and components). Example wrapper: `client/src/app/dashboardWrapper.tsx`.
- Global state and client API helpers: `client/src/app/redux.tsx` and `client/src/state/api.ts`.
- Backend HTTP server: `server/src/index.ts` — routes mounted at `/dashboard`, `/api/support`, `/api/schemas`, `/api/admin/users`.
- Express route patterns live in `server/src/routes/` (e.g., `dashboardRoutes.ts`, `usersRoutes.ts`). Controllers are under `server/src/controllers/`.
- Prisma schema and models: `server/prisma/schema.prisma`. Seed and migration assets are in `server/prisma/` and `server/prisma/seed.ts`.

## Common commands
- Frontend (from `client/`):
  - `npm run dev` — start Next dev server (Next 13 app router)
  - `npm run build` — build Next app
  - `npm run start` — start built Next app
- Backend (from `server/`):
  - `npm run dev` — runs tsc watch + `nodemon --exec ts-node src/index.ts` via `concurrently`
  - `npm run build` then `npm run start` — compile and run `dist/index.js`
  - `npm run seed` — run `prisma/seed.ts` (seeds JSON files under `server/prisma/seedData`)
  - `npm run prisma <args>` — run Prisma CLI (migrations, db push, etc.)

## Environment & integrations
- Server expects a `.env` with `DATABASE_URL` for Postgres (used by Prisma). See `server/prisma/schema.prisma`.
- Static JSON/data is served from `/data` mapped to `server/data` (see `server/src/index.ts` static mount).

## Project-specific patterns and conventions
- Frontend uses the Next `app/` directory (server components & client components). Prefer placing pages under `client/src/app/<route>/page.tsx` and shared components in `client/src/app/(components)/`.
- Server organizes routes under `server/src/routes/` and controllers under `server/src/controllers/`. New API endpoints should follow this pattern and export Express routers.
- Prisma models use simple string IDs (e.g., `userId`, `productId`). Seed data JSON files exist in `server/prisma/seedData/` and use those IDs — keep formats compatible.
- TypeScript is used across both packages; prefer adding types in `client/src/types` and using `ts-node` for server dev flows.

## What to avoid / be careful about
- Do not assume a single-package repo workflow: run frontend and backend separately when testing integration.
- Don't change major framework versions without testing (Next 16, React 19, Prisma 5 are in use).
- Database migrations: the repo has migrations under `server/prisma/migrations/`; be cautious merging migration histories.

## Examples for common tasks
- To add an API route:
  1. Create `server/src/routes/myRoute.ts` exporting an Express Router.
  2. Implement handlers in `server/src/controllers/myController.ts` and import into `index.ts`.
  3. Add tests or a quick curl against `http://localhost:8000/<your-path>`.
- To add a frontend page:
  1. Add `client/src/app/new-route/page.tsx` (or folder-based route with components).
  2. Use `DashboardWrapper` for consistent layout if needed: see `client/src/app/layout.tsx`.


## GOLDEN RULES for AI agents (User-Enforced)

1. Always create restore point of only the code in the file you are going to make changes to using robocopy but never use powershell to do it before making any changes. The restore point must only include only all files and folders needed to only restore the code change not the full site, excluding build artifacts, node_modules, .git, etc.
2. Always use only one PowerShell or Node terminal window for all commands—never spawn new terminals.
3. Never ask the user to run commands, copy-paste, or do manual steps; always perform all steps yourself.
4. If a step cannot be performed automatically, explain why and provide a workaround, but always attempt it yourself first.
5. At the end of every session, generate and save a statistical performance review report to E:\AI Costs, analyzing all mistakes, dropped content, and adherence to GOLDEN rules.
6. Never delete or overwrite user code without a backup/restore point.
7. Always restore the site to a working state if an error is introduced.
8. Always follow live, step-by-step debugging and output for every action.
9. Never batch or skip todo list steps; mark each as completed immediately after finishing.
10. Always use the exact scripts and commands from package.json for running and testing.
11. Never change major framework versions without explicit user approval and full testing.
12. Always document and enforce all user-specified GOLDEN rules in this file.
13. Always warn the user and get explicit confirmation before executing any action that would violate a GOLDEN rule, even if the user requests it. Never proceed with a GOLDEN rule violation without clear user approval after warning.
14. Prefer using Node/npm scripts and cross-platform commands for automation. Avoid PowerShell-specific commands unless the environment explicitly requires them.
15. Dont use this set of rules to say you cant do or fix something, you need to always find a correct alternavie to fix anything in the correct manner!

## Quick pointers for AI agents
- Read `server/src/index.ts` first to understand mounted routes and static locations.
- When editing DB models, open `server/prisma/schema.prisma` and check `server/prisma/migrations/` and `server/prisma/seedData/`.
- Use exact local scripts shown in `client/package.json` and `server/package.json` for running and testing.

---
If anything here is unclear or you'd like additional examples (tests, CI, or contribution standards), tell me which area to expand. 
