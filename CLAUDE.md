# DeckForge — Agent Instructions

## Project Overview

Single-file browser app for designing Elgato Stream Deck button layouts and Logitech MX Master wheel profiles. Supports 4 device types with zone-coded key categories and export to JSON/CSV/streamDeckProfile formats.

## Stack

- Single-file HTML (`index.html`) with inline CSS and JS
- Google Fonts (DM Mono, Syne) via CDN
- Zero dependencies, no npm, no build step

## Key Decisions

- Entire app must remain a single file. Splitting is prohibited.
- State is in-memory JS object with full re-render on every change via `render()`.
- State persists to localStorage via `saveState()` and `restoreState()`. JSON export/import remains available for sharing.
- 4 device types (XL, MK.2, Mini, Plus) with grid reflow on device switch.
- All user input escaped via `escHtml()` / `escAttr()` before DOM insertion.

## Documentation Maintenance

- **Issues**: Track in CLAUDE.md issue tracker table below
- **Session log**: Append to `/Users/daverobertson/Desktop/Code/95-docs-personal/today.csv` after each meaningful change

## Issue Tracker

| ID | Severity | Status | Title | Notes |
|----|----------|--------|-------|-------|
| DF-1 | High | Done | Harden persisted state and imports | Restored state and import payloads are normalized before assignment so malformed JSON/localStorage data cannot overwrite live state. |
| DF-2 | Medium | Done | Profile workflow polish and export fidelity | Main profiles now support rename/duplicate/delete actions, wheel profiles can be renamed/duplicated/deleted, and Stream Deck exports preserve a full DeckForge payload for round-tripping. |

## What This Is

Single-file HTML Stream Deck profile generator. Zero dependencies, zero build step. Runs in any browser.

## Architecture

- **Single file:** `index.html` — all HTML, CSS, and JS inline.
- **No backend.** State uses localStorage for session recovery; exports to JSON files remain available for sharing.
- **No dependencies.** No frameworks, no npm, no build tools.
- **State:** In-memory JS object (`state`). Render is a full re-render on every change.

## Key Concepts

- **Devices:** XL (8×4), MK.2 (5×3), Mini (3×2), Plus (4×2 + 4 dials). Switching reflows the grid.
- **Zones:** 8 color-coded categories (Dev, AV, Notion, Lighting, Print, Deploy, Music, Utility). Each key belongs to one zone.
- **Actions:** Hotkey, Open URL, Shell Command, System, OBS WebSocket, vMix API, AppleScript, None.
- **Wheel Profiles:** Logitech Options+ MX Master wheel bindings. Per-profile, per-app scroll/click mappings.
- **Export formats:** DeckForge JSON (full schema), Stream Deck .streamDeckProfile approximation with embedded DeckForge payload, CSV.

## File Structure

```
deckforge/
  index.html          — the entire app
  CLAUDE.md           — this file
  AGENTS.md           — codex prompt
```

## Conventions

- All state mutations go through `updateKey()`, `updateWheel()`, or direct `state.*` assignment followed by `render()`.
- `render()` calls sub-renderers: `renderGrid()`, `renderPanel()`, `renderWheel()`, etc.
- HTML is built with template literals. No JSX, no virtual DOM.
- Escape all user input with `escHtml()` / `escAttr()` before inserting into markup.
- Zone colors are defined in `ZONES` array. CSS custom properties mirror them.

## What Not To Do

- Do not add external dependencies (React, Tailwind, etc.).
- Do not split into multiple files.
- Do not add a build step.
- State persists to localStorage via saveState() / restoreState(). Export/import remains available for sharing.
- Do not add server-side functionality.

## Testing

Open `index.html` in a browser. No test framework. Manual verification:
- Click each device tab — grid reflows correctly.
- Click a key — editor panel appears with correct data.
- Change icon, label, zone, action — grid updates immediately.
- Export JSON — file downloads with correct schema.
- Duplicate/rename a profile — the copy keeps the source layout and wheel profiles, and the active profile updates to the new copy.
- Import JSON — layout restores correctly.
- Wheel profiles — tabs switch, bindings editable, new profiles addable, and rename/duplicate/delete actions keep the active wheel selection valid.
- Stream Deck export/import — exported `.streamDeckProfile` files should retain a DeckForge payload so importing the file back into DeckForge restores the original layout.

## Design Tokens

```
Background: #0f0f12, #1a1a22, #24242e
Border: #2e2e3a
Text: #e8e6f0 (primary), #9896a8 (secondary)
Accent: #7c6cf0 (purple), #a78bfa (light purple)
Zones: see ZONES array in JS
```
