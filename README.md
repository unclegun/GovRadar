# StrataStack Contract Radar

[![Deploy Vite App to GitHub Pages](https://github.com/unclegun/GovRadar/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/unclegun/GovRadar/actions/workflows/deploy-pages.yml)

Live Site: https://unclegun.github.io/GovRadar/

Frontend-only MVP web app for small businesses, consultants, and subcontractors tracking U.S. government contracting opportunities.

Built with React + Vite + plain JavaScript + Tailwind CSS, with all persistence in localStorage.

## MVP Scope

- Dashboard with saved activity and due-date intelligence
- Opportunity Search with filters, fit scoring, details drawer, and presets
- Watchlist management with editable status/notes/priority and CSV export
- Agency Intelligence page with spending summaries and local snapshots
- Prime Finder with vendor aggregation and saved-prime notes + CSV export
- Pipeline Kanban board with drag-and-drop and modal editing
- Capability Statement Builder with live preview and print/PDF output
- Settings page for business profile configuration and JSON import/export

## Tech Stack

- React 19
- Vite 8
- React Router
- Tailwind CSS
- dnd-kit
- localStorage persistence wrappers and custom hooks

## Data Strategy

- App uses live federal data sources only.
- `src/api/samApi.js` integrates with SAM.gov opportunities.
- `src/api/spendingApi.js` integrates with USAspending award search.
- Add `VITE_SAM_API_KEY` in `.env.local` for SAM.gov access.
- USAspending live mode does not require an API key; the app uses contract award types (`A`, `B`, `C`, `D`) to satisfy API validation rules.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production build locally:

```bash
npm run preview
```

## Local Storage Keys

- `ss_business_profile`
- `ss_watchlist`
- `ss_saved_primes`
- `ss_pipeline_board`
- `ss_search_presets`
- `ss_capability_statement`
- `ss_ui_preferences`
- `ss_intel_snapshots`

## Project Structure

```text
src/
	api/                # live data adapters (SAM / spending)
	components/         # layout and reusable UI
	constants/          # shared constants (storage keys)
	data/               # reference lists and seeded defaults
	hooks/              # localStorage-backed domain hooks
	pages/              # top-level route pages
	services/           # storage wrappers
	utils/              # scoring, format, import/export helpers
```

## GitHub Pages Deployment

This project uses hash-based routing so deep links work on GitHub Pages without server rewrites.

### Recommended (GitHub Actions)

1. Commit and push to `main`.
2. In GitHub repo settings:
	- Pages -> Build and deployment -> Source: `GitHub Actions`
3. The workflow `.github/workflows/deploy-pages.yml` builds and publishes `dist` automatically.

### Manual (optional)

You can still deploy manually with:

```bash
npm run deploy
```

If using manual deploy, set Pages source to `gh-pages` branch.

### If You See 404 for `/src/main.jsx`

GitHub Pages is serving source files instead of the Vite build output. Fix by switching Pages source to either:

- `GitHub Actions` (recommended), or
- `gh-pages` branch when using `npm run deploy`

## Future Backend Extension Path

- Replace live public API adapters in `src/api/*.js` with authenticated API clients.
- Keep page and component contracts unchanged by preserving normalized record shape.
- Move persistence from localStorage hooks to service APIs progressively by domain.
