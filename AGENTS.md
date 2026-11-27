# AGENTS.md

M.U.S.T escape game: static HTML/CSS/JS, no dependencies. No build step, package manager, backend, tests, lint, or CI. Keep it that way unless asked.

## Map
- `controle/` — 1920×1080 hub and code entry: `index.html` (intro) → `menu.html` (5 station cards + status) → `<station>.html` (4-digit code) → `final.html`; also `plan`, `camera`, `chien`, `bonus`.
- `miroir/` 1024×768 · `frigo/` 768×1024 · `reveil/` 844×390 · `aspirateur/` 844×390 — standalone kiosk simulations.
- `shared/` — `css/win95.css` (Win95 components) and `js/stage.js` (scales `.stage`).
- Root `index.html` is a station launcher, not the game entry. The control entry is `controle/index.html`.
- The thermostat game is a separate `temp-ctrl` repo; only `controle/thermostat.html` (code entry) is here.
- Simulations and code screens are separate by design (one kiosk per screen). Confirm before merging them.

## Conventions
- Each page uses `<main class="stage">`; the body class sets `--stage-w`/`--stage-h`. Layout is absolute Figma pixels. Don't change stage dimensions without redoing positions.
- Load `shared/css/win95.css` before page CSS. Reuse `.relief-window`, `.relief-button`, `.btn`, `.window`, `.titlebar`; don't reimplement them.
- UI copy and comments are French. Keep them French.
- Miroir/aspirateur use delegated `data-open`/`data-close` (aspirateur also `data-panel`); réveil switches `section.screen` via `hidden`.

## Progress / codes
- `controle/<station>.html` calls `mountStation()` from `controle/js/station.js`; `solution` is set per page.
- A correct code writes `localStorage["must:<id>"]` and emits `station:validate`; `menu.html` reads the key to show "Connecté" and the letter.
- Reset: `controle/menu.html?reset`.
- Codes are in `readme.md` and each station HTML. They are puzzle data; don't change without asking.

## Checks
- No test suite. JS syntax check: `for f in $(find . -name '*.js' -not -path './.git/*'); do node --check "$f"; done`.
- Assets are large. `*/fetch-assets.sh` download Figma exports from links that expire 2026-12-03 and overwrite files; don't run unless assets are missing.
- Verify in a browser at the target stage size.
