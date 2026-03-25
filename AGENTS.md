# DeckForge — Codex Prompt

## Project Context

DeckForge is a single-file HTML Stream Deck profile generator at `index.html`. No dependencies, no build step. All CSS and JS are inline.

## Codex Task Guidelines

When working on this project:

1. **Read `CLAUDE.md` first** for architecture constraints and conventions.
2. **All changes go in `index.html`** — do not create additional files.
3. **Escape user input** — use `escHtml()` and `escAttr()` for any string inserted into markup.
4. **Test by opening in browser** — no test framework exists.
5. **Do not add dependencies** — no npm, no CDN imports, no frameworks.

## Common Tasks

### Add a new zone color
- Add entry to `ZONES` array with `{ id, label, color }`.
- Zone chips in the editor panel render automatically.

### Add a new action type
- Add string to `ACTION_TYPES` array.
- Add placeholder text in `getPlaceholder()` function.
- Export format in `buildExport()` handles all types generically.

### Add a new device target
- Add entry to `DEVICES` array with `{ id, label, cols, rows, dials }`.
- `initKeys()` and `renderGrid()` handle arbitrary grid sizes.
- `renderDialRow()` shows dials when `dials > 0`.

### Add a new export format
- Add format ID to the format tabs in `renderExportSection()`.
- Add branch in `buildExport()` to produce the output.
- File extension and MIME type set in `exportDownload()`.

## State Shape

```javascript
state = {
  device: 'xl',                    // Active device ID
  keys: [                          // Array of key objects (length = cols × rows)
    { icon, label, zone, action, value, active, desc }
  ],
  selectedIdx: null,               // Currently selected key index
  wheelProfiles: [                 // Logitech wheel profiles
    { id, label, bindings: [{ app, up, down, click }] }
  ],
  activeWheelProfile: 'dev',       // Active wheel profile ID
  exportFormat: 'deckforge',       // Active export format
}
```

## Issue Tracker

| ID | Status | Description |
|----|--------|-------------|
| — | — | No issues logged yet |
