# DeckForge

A single-file browser app for designing Elgato Stream Deck button layouts and Logitech Options+ MX Master wheel profiles, with export to JSON, CSV, and an approximate `.streamDeckProfile` format.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The entire app — layout editor, wheel-profile editor, export/import. All HTML, CSS, and JS inline. |
| `ops-dashboard.html` | A status dashboard that renders `ops-state.json` (project health: git state, freshness, open issues). |
| `ops-state.json` | Generated snapshot consumed by `ops-dashboard.html`. Not meant to be hand-edited. |
| `ops-state.schema.json` | JSON Schema for `ops-state.json`. |
| `tools/ops/build-ops-state.mjs` | Node script that inspects the repo (git branch/dirty state, file presence, staleness) and regenerates `ops-state.json`. Read-only — it never touches source files. |
| `CLAUDE.md` | Agent-facing project brief: architecture, conventions, issue tracker, and design tokens. |
| `favicon.svg` | Site favicon. |

## How to run

No build step, no dependencies, no `package.json`.

- **App:** open `index.html` directly in a browser.
- **Ops dashboard:** open `ops-dashboard.html` in a browser to view current project status.
- **Refresh the dashboard data:** `node tools/ops/build-ops-state.mjs` (regenerates `ops-state.json` from the current git/file state).

## What it does

- Supports 4 Stream Deck device types (XL 8×4, MK.2 5×3, Mini 3×2, Plus 4×2 + 4 dials), with the grid reflowing on device switch.
- Keys are organized into 8 color-coded zones (Dev, AV, Notion, Lighting, Print, Deploy, Music, Utility) and support actions: Hotkey, Open URL, Shell Command, System, OBS WebSocket, vMix API, AppleScript, or None.
- Multiple named profiles, each with its own key layout and set of Logitech Options+ wheel profiles (per-app scroll/click bindings).
- State is held in-memory and persisted to `localStorage`; JSON export/import is available for backup and sharing. Stream Deck exports embed a full DeckForge payload so a `.streamDeckProfile` export can be re-imported without data loss.

## Conventions

- The app is intentionally kept as a single file (`index.html`) — no framework, no bundler, no build step. See `CLAUDE.md` for the full set of architectural constraints and the issue tracker.
- All user input is escaped (`escHtml()` / `escAttr()`) before being inserted into the DOM.
