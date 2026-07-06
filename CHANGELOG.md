# Changelog

All notable changes to DeckForge, grouped by date.

## 2026-07-06 — Licensing
- Added `LICENSE` (explicit all-rights-reserved).

## 2026-06-20 — Favicon
- Added site favicon as part of a favicon audit remediation pass.

## 2026-05-30 — Security and correctness hardening (PR #1: `fix/import-xss-and-csv`)
- Closed Import JSON XSS sinks and escaped CSV cells on export.
- Closed a CSV TAB/CR leader bypass and de-duplicated ids after normalization.
- Closed a CSV control-character bypass and a ReDoS vector in the highlight regex.
- Fixed correctness issues: import race condition, prompt-cancel handling, device-tab sync, and a blob URL leak.
- General cleanup pass: performance, accessibility, regex correctness, state migration, and dead UI removal.
- Fixed correctness issues: per-profile device tracking, off-grid key selection, dial guard, active-id resolution, v1-to-current single-profile migration, and empty-import handling.

## 2026-04-24 — Initial release
- Added the ops dashboard (`ops-dashboard.html`, `ops-state.json`, `ops-state.schema.json`, `tools/ops/build-ops-state.mjs`) alongside the core DeckForge layout editor and multi-profile / wheel-profile workflows.
