# DeckForge — Agent Instructions

## What This Is

Single-file HTML Stream Deck profile generator. Zero dependencies, zero build step. Runs in any browser.

## Architecture

- **Single file:** `index.html` — all HTML, CSS, and JS inline.
- **No backend.** No localStorage (exports to JSON files instead).
- **No dependencies.** No frameworks, no npm, no build tools.
- **State:** In-memory JS object (`state`). Render is a full re-render on every change.

## Key Concepts

- **Devices:** XL (8×4), MK.2 (5×3), Mini (3×2), Plus (4×2 + 4 dials). Switching reflows the grid.
- **Zones:** 8 color-coded categories (Dev, AV, Notion, Lighting, Print, Deploy, Music, Utility). Each key belongs to one zone.
- **Actions:** Hotkey, Open URL, Shell Command, System, OBS WebSocket, vMix API, AppleScript, None.
- **Wheel Profiles:** Logitech Options+ MX Master wheel bindings. Per-profile, per-app scroll/click mappings.
- **Export formats:** DeckForge JSON (full schema), Stream Deck .streamDeckProfile approximation, CSV.

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
- Do not add localStorage persistence (export/import is the persistence model).
- Do not add server-side functionality.

## Testing

Open `index.html` in a browser. No test framework. Manual verification:
- Click each device tab — grid reflows correctly.
- Click a key — editor panel appears with correct data.
- Change icon, label, zone, action — grid updates immediately.
- Export JSON — file downloads with correct schema.
- Import JSON — layout restores correctly.
- Wheel profiles — tabs switch, bindings editable, new profiles addable.

## Design Tokens

```
Background: #0f0f12, #1a1a22, #24242e
Border: #2e2e3a
Text: #e8e6f0 (primary), #9896a8 (secondary)
Accent: #7c6cf0 (purple), #a78bfa (light purple)
Zones: see ZONES array in JS
```
