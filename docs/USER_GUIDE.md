# DeckForge — User Guide

DeckForge is a planning tool for Elgato Stream Deck layouts and Logitech Options+ MX Master wheel bindings. It does not talk to a physical device over USB — it's a layout designer that outputs files you use as a reference (or import into) Stream Deck / Options+ software.

## Getting started

Open `index.html` in a browser. Nothing to install — state is saved to your browser's `localStorage` automatically, so your layout survives a refresh.

## Choosing a device

Use the tabs in the header to pick a device: **XL** (8×4, 32 keys), **MK.2** (5×3, 15 keys), **Mini** (3×2, 6 keys), or **+** (4×2, 8 keys plus 4 encoder dials). The grid reflows immediately, and the **+** model reveals an extra "Encoder Dials" section.

## Editing a key

1. Click any key on the grid to select it. The right-hand panel switches to the **Edit Key** tab.
2. Set an **icon** (emoji), a short **label**, and a **zone color** — zones are color-coded categories (Dev, Production AV, Notion/OS, Lighting/AV, 3D Print, Deploy, Music, Utility) that make a busy grid scannable at a glance.
3. Optionally check **Mark Active** to show a small green indicator dot on the key.
4. Under **Action**, choose an action type — Hotkey, Open URL, Shell Command, System, OBS WebSocket, vMix API, AppleScript, or None — and fill in the action value plus an optional description.

Use **clear key** (header) to reset the selected key, or **clear all** to wipe the whole grid.

## Profiles

The sidebar's **Profiles** section lists your saved profiles (e.g. "DaveDeck v1"). Each profile has its own key layout and its own set of wheel profiles.

- **+ new profile** creates a blank profile.
- Per-profile actions let you rename, duplicate, or delete a profile. Duplicating keeps the source's key layout and wheel profiles, and switches you to the new copy.

## Wheel profiles (Logitech Options+ MX Master)

Switch to the **Wheel** tab in the right panel to manage MX Master wheel bindings, independent of the key grid:

- Each wheel profile (e.g. "Dev", "Production", "Bambu") maps an app to a **scroll up**, **scroll down**, and **click** action.
- Use the profile dropdown to switch which wheel profile is active, edit bindings inline, and **save profile** to persist changes. New wheel profiles can be added, and existing ones renamed/duplicated/deleted from the sidebar.

## Exporting and importing

Switch to the **Export** tab:

1. Name your layout under **Profile Name**.
2. Pick an **Export Format**:
   - **DeckForge native** — the full DeckForge schema (profiles, keys, wheel profiles). Best for backup and re-import into DeckForge.
   - **Stream Deck profile (`.streamDeckProfile`)** — an approximation of Elgato's format, with a full DeckForge payload embedded so re-importing the same file back into DeckForge restores the original layout exactly.
   - **CSV** — flat, human-readable output for documentation or sharing outside DeckForge.
3. Use **copy** to copy the JSON output, or **download .json** to save a file. **import .json** restores a previously exported layout.

## Ops dashboard (for maintainers)

`ops-dashboard.html` is a separate, read-only status page for this repo (git branch/dirty state, freshness, open issues) — it's a project-health view, not part of the end-user layout tool. Regenerate its data with `node tools/ops/build-ops-state.mjs`.
