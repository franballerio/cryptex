# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - Chat File Upload & Matrix Animation System

### Added
- **File Upload API Layer** (`src/services/api.js`):
  - `uploadChatFiles(formData)` function for batched multipart file uploads to `/media/upload`
  - Automatic credential passing and error normalization
- **Socket Service Enhancement** (`src/services/socket.js`):
  - Extended `sendMessage()` to accept optional `attachments` parameter
  - Backward compatible with text-only message payloads
- **Matrix Animation System** (`src/index.css`):
  - `.matrix-upload-overlay` - full-screen transmission overlay with animated grid background
  - `.matrix-upload-scanline` - top-to-bottom scanline effect during file transmission
  - `.matrix-upload-progress` - progress bar with pulsing glow animation
  - `.matrix-upload-status` - animated status text with text-shadow effects
  - `.file-chip` - selected file visual chips with size metadata and remove button
  - `.attachment-link` - clickable attachment rendering in messages with hover effects
  - All animations maintain aesthetic consistency with existing tactical terminal theme
- **File Picker UI** (`src/components/ChatWindow.jsx`):
  - `[ ADJUNTAR ]` button for file selection (hides label on small screens)
  - File chips display below input area with filename truncation and file size
  - Remove button (✕) per file with hover opacity transition
  - Attachment links in message bubbles with file icon and downloadable URLs
  - Error banner for upload failures
  - Disabled send controls during file transmission phase
- **Chat Upload Orchestration** (`src/pages/Chat.jsx`):
  - New `handleSendMessage({ content, files })` signature supporting text + files
  - Sequential upload flow: batch HTTP upload → await MinIO URLs → emit socket message
  - `isSendingFiles` state management for UI feedback
  - `sendError` state with dismissible error display
  - Upload progress logged to system telemetry panel (SYS_LOG)
  - Sentinel text `[ARCHIVOS]` for files-only messages (DB compatibility)
  - Graceful error handling with retry capability

### Changed
- **Vite Dev Server** (`vite.config.js`):
  - Added `/media/upload` proxy target for local development
- **ChatWindow Component** (`src/components/ChatWindow.jsx`):
  - `handleSubmit()` refactored to accept `{ content, files }` payload instead of string
  - `onSendMessage` prop now receives object with content and files, not just text
  - Message rendering extended to display attachments below text content
  - File input handling with multiple file support and automatic form clearing
  - Submit button disabled when both text and files are empty, or during transmission
- **Chat Page** (`src/pages/Chat.jsx`):
  - `handleSendMessage` upgraded from simple text pass-through to full async upload handler
  - Added state props to ChatWindow: `isSendingFiles`, `sendError`
  - Imported `uploadChatFiles` from API layer

### Technical Details
- **Multipart Upload**: Files sent as `FormData` with `chat_id` and `receiver_id` context
- **Socket Payload**: Messages emit with optional `attachments: [{ file_url, file_type, original_name, size_bytes, object_key }]`
- **Backward Compatibility**: Existing text-only chat flow unchanged; attachment field optional
- **Build**: Production build passes with zero warnings; CSS properly layered and valid
- **Build Size**: 30.91 kB CSS (6.73 kB gzip) + 271.44 kB JS (81.33 kB gzip)

---

## [Unreleased] - UI/UX Overhaul: Nothing Design & Tactical Terminal

### Added
- **Typography**: Integrated `Doto` (hero numbers), `Space Grotesk` (body), and `Space Mono` (labels, metadata, terminal output) into the project.
- **Design Tokens**: Configured `tailwind.config.js` with a new strict monochromatic dark mode palette (`#000000` background, `#111111` surfaces) and specialized status colors (accent, success, warning).
- **Custom Utilities**: Added military and tactical CSS utilities in `src/index.css` including:
  - `.scanline` and animated `.radar-sweep`
  - `.hazard-stripes` and `.hazard-stripes-dim`
  - `.crosshairs`
  - `.redacted` text blocks
  - `.terminal-cursor` blinking animations
  - `.panel-border` for consistent structural boxing

### Changed
- **Global Layout & Auth**: Refactored `Layout.jsx`, `ProtectedRoute.jsx`, and `Login.jsx` to adopt the minimalist "Nothing" design system.
- **Chat Interface (`Chat.jsx`, `TopBar.jsx`, `UserList.jsx`, `ChatWindow.jsx`)**:
  - Transformed the communication view into a "Top Secret" secure terminal.
  - Converted the standard user list into an "Asset Tracking" directory.
  - Overhauled the right-hand "Telemetry" sidebar to feature an animated `SAT_RADAR` sweep, uplink status, and an auto-scrolling `SYS_LOG` feed.
  - Integrated classification banners (e.g., "MODULE_04 // SECURITY_CORE").
- **Security Vault (`Vault.jsx`)**: 
  - Completely stripped out former Material Design 3 tokens and classes.
  - Applied the new monochromatic palette, utilizing `bg-surface-raised` and `border-visible`.
  - Redesigned the entropy metrics, RSA/PGP master key status, and system override panels with high-contrast, tactical styling (crosshairs, hazard stripes, bold mono-font data visualization).
- **Network Scanner (`NetworkScanner.jsx`)**:
  - Integrated the global tactical `TopBar`.
  - Replaced the standard dot-grid background with a subtler tactical variant (`.dot-grid-subtle`).
  - Updated the global scan map, signal integrity graphs, telemetry stream, and connection logs to use strict typography hierarchies and `.panel-border` layouts.