# Echo Knight (cryptex) Development Guide

This file contains high-signal, repo-specific context for autonomous agents working in this repository. The repo contains two separate projects: `front` and `back`.

## Repository Structure & Boundaries
- `front/`: React 18 frontend built with Vite.
- `back/`: Express.js + Socket.io backend.

Both projects use **pnpm** as their package manager. Do not use `npm` or `yarn`. Always cd into the respective directory (`front/` or `back/`) before running commands.

## Frontend (`front/`)
- **Framework:** React 18, React Router v6.
- **Language:** JavaScript (`.js`/`.jsx`). There is no TypeScript configuration. Do NOT add `.ts`/`.tsx` files.
- **Styling:** TailwindCSS (config in `tailwind.config.js`, global styles in `src/index.css`). Use Tailwind utility classes strictly.
- **Commands:**
  - Dev server: `pnpm run dev`
  - Build: `pnpm run build`
- **Routing Quirk:** The Vite config (`vite.config.js`) proxies API requests (`/api`, `/auth/*`, `/users/getUsers`) directly to `http://localhost:3000`. Ensure the backend is running on port 3000 when testing.
- **Application State:** Global state is provided via `<AuthProvider>` (`src/context/AuthContext.jsx`). Main router is in `src/App.jsx`.
- **Note:** There are no test or lint scripts configured in `package.json`. Do not hallucinate commands like `pnpm test` or `pnpm run lint`.

## Backend (`back/`)
- **Framework:** Node.js + Express.js + Socket.io.
- **Language:** JavaScript (`.js` files with ES Modules enabled `type: "module"`). No TypeScript.
- **Database:** PostgreSQL (via `pg` module).
- **Architecture Pattern:** Feature-based modules (e.g., `src/modules/auth/`, `src/modules/chat/`).
- **Commands:**
  - Dev server: `pnpm run dev` (Runs `node --watch ./src/index.js`)
- **Infrastructure:** A `docker-compose.yml` is available in `back/` to spin up PostgreSQL, RabbitMQ, Redis, MinIO, and Adminer (`docker-compose up -d`). Currently, the core backend primarily relies on PostgreSQL and Socket.io.
- **Note:** Older `AGENTS.md` files in this project falsely claimed the backend used Fastify, Zod, and Argon2id. Trust the `back/package.json` and the Express app in `back/src/index.js` over older documentation.
- **Note:** There are no tests, typechecks, or linting commands configured in `package.json`. `pnpm test` will fail.

## Development Workflow
1. Use `pnpm install` in both `front/` and `back/` directories.
2. Run `pnpm run dev` in `back/` to start the Express API on `localhost:3000`.
3. Run `pnpm run dev` in `front/` to start the Vite dev server.