# Changelog

## [Unreleased]
### Added
- Created `FIX.md` to document fixes and issues.
- Added `TODO.txt` for project task tracking.
- Introduced `chat.repository.js` to separate database queries from `chat.service.js` business logic.
- Added `io.router.js` for socket.io routing.
- Re-implemented `JWT.js` at the new `src/modules/auth/` location.

### Changed
- **Project Structure**: Moved all backend code from the `backend/` subdirectory to the root directory. This includes `src/`, `package.json`, `docker-compose.yml`, and `pnpm-lock.yaml`.
- **Core Infrastructure**: 
  - Updated configuration setup (`config.js`).
  - Improved database connection logic (`db.conn.js`) and diagram documentation (`db.diagram.md`).
  - Refactored RabbitMQ client (`rabbit.client.js`) and consumer (`rabbit.consumer.js`).
  - Improved Redis client functionality (`redis.client.js`).
- **Authentication Module**: Refactored `auth.controller.js`, `auth.service.js`, `auth.repository.js`, and `auth.router.js` to align with the new structure and resolve API issues.
- **Chat Module**: Refactored `chat.controller.js`, `chat.service.js`, and `chat.router.js` for better separation of concerns (delegating DB ops to the new repository layer).
- **Socket.io Module**: Refactored Socket.io handler into `io.controller.js` and middleware components (`io.authorization.js`).
- **Entry Point**: Updated `index.js` to reflect the newly refactored services and routing.

### Removed
- Removed the old `backend/src/modules/socketio/io.handler.js` in favor of the new controller/router pattern.
- Cleaned up obsolete files (`backend/src/modules/auth/JWT.js`, `backend/src/modules/chat/chat.service.js`).

### Fixed
- Fixed API functionality (`api funciona correctamente`).
