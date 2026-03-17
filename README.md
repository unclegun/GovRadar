# StrataStack Contract Radar

A frontend-only MVP web application for U.S. government contract tracking and business development.

## Features

- **Opportunity Search** — Search SAM.gov contract opportunities with keyword, agency, NAICS, and set-aside filters
- **Fit Scoring** — Automated 0–100 fit score based on your business profile
- **Watchlist** — Save, track, and annotate opportunities with status and priority
- **Agency Intelligence** — Research agency budgets, award patterns, and spending
- **Prime Finder** — Discover teaming and subcontracting partners
- **Pipeline** — Drag-and-drop Kanban board for opportunity pipeline management
- **Capability Statement** — Build and print a professional capability statement
- **Settings** — Configure your business profile for personalized scoring

All data is stored in `localStorage`. The app currently runs in mock data mode.

## Tech Stack

- React 19 + Vite 8
- React Router v7 (HashRouter for GitHub Pages compatibility)
- Tailwind CSS v4
- @dnd-kit (drag-and-drop kanban)
- Pure JavaScript (no TypeScript)

## Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/GovRadar/`

## Build

```bash
npm run build
```

Output goes to the `dist/` directory.

## Deploy to GitHub Pages

```bash
# Build the project
npm run build

# Deploy using gh-pages (install first if needed)
npm install -g gh-pages
gh-pages -d dist
```

Or use the GitHub Actions workflow to automatically deploy on push to `main`.

The `base: '/GovRadar/'` in `vite.config.js` and `HashRouter` ensure correct routing on GitHub Pages.

## Project Structure

```
src/
  data/           Mock data (opportunities, awards, agencies, vendors)
  api/            SAM.gov and USASpending.gov adapters (mock mode)
  utils/          Scoring, formatters, CSV/JSON export, localStorage
  hooks/          Custom React hooks for all state management
  components/     Reusable UI components + layout + feature components
  pages/          8 page-level components
```

## Configuration

To connect to live APIs in the future:
1. Replace mock implementations in `src/api/samApi.js` with real SAM.gov API calls
2. Replace mock implementations in `src/api/spendingApi.js` with real USASpending.gov API calls
3. Set `isMockMode = false` in both files
