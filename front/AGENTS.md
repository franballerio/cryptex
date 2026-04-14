# Echo Knight Frontend (cryptex_front)

This file contains high-signal context and repo-specific conventions for autonomous agents working in this repository.

## Architecture & Stack
- **Framework:** React 18, React Router v6, TailwindCSS, Socket.io-client.
- **Language:** JavaScript (`.js`/`.jsx`). There is no TypeScript configuration or typecheck step. Do not add `.ts`/`.tsx` files or assume typechecking is available.
- **Build Tool:** Vite.
- **Package Manager:** `pnpm` (`pnpm-lock.yaml` is present). Always use `pnpm` for managing dependencies (e.g., `pnpm install`, `pnpm run dev`).

## Commands & Development Workflow
- **Dev Server:** `pnpm run dev`.
  - **Important Routing Quirks:** The Vite config (`vite.config.js`) proxies API requests (`/api`, `/auth/*`, `/users/getUsers`) directly to `http://localhost:3000`. If you are testing API integrations, assume the backend service needs to run on port 3000.
- **Build:** `pnpm run build`.
- **Lint/Test:** There are currently no strict linting, formatting, or testing commands defined in `package.json`. Do not hallucinate `pnpm test` or `pnpm run lint` commands unless they are explicitly added later.

## Application Structure & State
- `src/main.jsx`: Application entrypoint. Global state is provided via `<AuthProvider>` (`src/context/AuthContext.jsx`).
- `src/App.jsx`: Main router.
  - **Routes:** `/` (Login), `/app/chat` (Chat), `/app/vault` (Vault), and `/app/network` (NetworkScanner).
  - **Note on Security:** The `<ProtectedRoute>` wrapper around the `/app` layout is currently commented out in `src/App.jsx`.
- **Layout:** Standard React conventions using `src/components/`, `src/pages/`, `src/context/`, and `src/services/`.

## Styling
- Rely strictly on TailwindCSS utility classes for styling. The configuration is in `tailwind.config.js` and global styles reside in `src/index.css`.
