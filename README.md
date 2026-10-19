# Pluto

Pluto is a personalized content discovery web app: an editorial **Discover** feed, an optional **My Space** session for the current hour, and a local-demo **Together** room for sharing and voting.

> Your interests shape what you discover. Your moment shapes what you need. Your people shape what you experience together.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`. Secrets stay on the server (Next.js Route Handlers). Do not put API keys in client components.

| Variable | Required | Purpose |
| --- | --- | --- |
| `TMDB_READ_ACCESS_TOKEN` | No | TMDB v4 bearer token for live movies, trending, and search |
| `TMDB_API_KEY` | No | Alternative TMDB v3 key if you do not have a read token |

News uses public BBC RSS feeds and does not need a key. If those feeds are unreachable, Pluto falls back to labelled sample briefings.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit and integration tests |
| `npm run test:e2e` | Playwright critical flows (install browsers with `npx playwright install chromium`) |

## Features

- Discover feed with mixed news, films, and sample social posts
- Skippable interest onboarding and an explainable preference scorer
- Favorites, dismiss, follow topic, and more/less topic signals (persisted in `localStorage`)
- Debounced global search across news, movies, and sample posts
- Trending from live providers when available
- My Space: voluntary vibe, company, budget, and setting — does not rewrite core interests
- Together: local groups, invite codes/links, shared cards, voting, planning room
- Drag-and-drop feed module order with keyboard move up/down
- Light and dark themes
- Responsive sidebar + compact mobile navigation

## Architecture

- **Next.js App Router** UI with Route Handlers in `src/app/api/*`
- **Redux Toolkit** for preferences, favorites, theme, layout, My Space session, Together
- **RTK Query** for `/api/news`, `/api/movies`, `/api/search`, `/api/trending`
- Shared `ContentItem` model in `src/lib/types.ts`
- Personalization in `src/lib/personalization.ts` (transparent weights, variety interleaving)

## Content sources and mock limitations

- **News (live):** BBC RSS, normalized on the server. Clearly falls back to sample briefings if feeds fail.
- **Movies (live when configured):** TMDB via server routes. Without credentials, labelled sample titles are shown.
- **Social:** typed mock feed only. Not claimed as Instagram/X/etc.
- **My Space places/events:** sample recommendations, labelled as such. No verified local listings API is configured.
- **Together:** localStorage demo. It does **not** sync across users or devices. Extra participants are sample profiles. There is no synchronized streaming playback.

## Personalization notes

Signals are weighted and capped so one click cannot take over the feed. Mood selections in My Space are session filters only. Reset personalization and feed order from Settings.

## Git

`.env.local` and other secret env files are gitignored. Commit `.env.example` only.
