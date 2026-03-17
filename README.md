# StrataStack Contract Radar

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

- App is functional by default in mock mode.
- `src/api/samApi.js` and `src/api/spendingApi.js` define adapter boundaries for mock/live swapping.
- Live SAM mode can be enabled with `VITE_SAM_API_KEY`, but mock remains the default for reliability.

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
	api/                # data adapters (SAM / spending)
	components/         # layout and reusable UI
	constants/          # shared constants (storage keys)
	data/               # mock datasets and seeded defaults
	hooks/              # localStorage-backed domain hooks
	pages/              # top-level route pages
	services/           # storage wrappers
	utils/              # scoring, format, import/export helpers
```

## GitHub Pages Deployment

This project uses hash-based routing so deep links work on GitHub Pages without server rewrites.

1. Ensure repository name is correct on GitHub (example: `GovRadar`).
2. Commit and push code to default branch.
3. Deploy:

```bash
npm run deploy
```

4. In GitHub repository settings, configure Pages source to `gh-pages` branch if needed.

## Future Backend Extension Path

- Replace mock adapters in `src/api/*.js` with authenticated API clients.
- Keep page and component contracts unchanged by preserving normalized record shape.
- Move persistence from localStorage hooks to service APIs progressively by domain.
