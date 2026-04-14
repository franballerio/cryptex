# AGENTS.md - Echo Knight Backend (cryptex) Development Guide

This file provides high-signal context and repo-specific conventions for autonomous agents working in the `back/` directory of the Echo Knight project.

## Architecture & Stack
- **Framework:** Node.js + Express.js + Socket.io. (Do NOT assume Fastify).
- **Language:** JavaScript (`.js` files). Uses ES Modules (`type: "module"` in `package.json`).
- **Database:** PostgreSQL (via `pg`).
- **Real-time:** Socket.io for WebSockets.
- **Package Manager:** `pnpm`. Always use `pnpm` (e.g., `pnpm install`, `pnpm run dev`).
- **Infrastructure:** Docker Compose is available for local services (`postgres`, `rabbitmq`, `redis`, `minio`, `adminer`). Start with `docker-compose up -d`.

## Code Style & Structure
- **Architecture Pattern:** Feature-based modules.
  ```
  src/
  ├── core/            # Database connections, core setup
  ├── modules/         # Feature modules (e.g., auth, users, chat)
  │   ├── auth/
  │   │   ├── auth.controller.js
  │   │   ├── auth.router.js
  │   │   └── ...
  ├── index.js         # Entry point (Express setup)
  ```
- **Routing:** Express routers are defined in each module and imported into `index.js`.
- **Environment:** Configuration is loaded via `dotenv`. Check `.env` (or create one based on `docker-compose.yml` and defaults) for variables like `APP_PORT` (usually 3000), DB credentials, etc.

## Commands & Development Workflow
- **Dev Server:** `pnpm run dev` (Runs `node --watch ./src/index.js`).
- **Testing & Linting:** There are currently **no strict testing, linting, or typechecking commands** configured in `package.json`. Do not hallucinate `pnpm test`, `pnpm lint`, or `pnpm typecheck` commands as they will fail.

## Key Principles
- **No TypeScript:** Do not add `.ts` files or assume typechecking is available.
- **Express, not Fastify:** Use Express standard `req`/`res` objects. Do not use Fastify-specific APIs or loggers (like Pino) unless explicitly added.
- **Security:** The backend acts as a relay for an End-to-End Encrypted (E2EE) communication platform. It should not inspect or attempt to decrypt message payloads.