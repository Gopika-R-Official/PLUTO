# Pluto — Curated Culture & Discovery Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://pluto-discovery.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-PLUTO-blue?style=for-the-badge&logo=github)](https://github.com/Gopika-R-Official/PLUTO)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

Pluto is a personalized, editorial discovery web application blending cinema, music, architecture, journalism, and culture into a singular, tactile digital experience.

> **Live Production:** [https://pluto-discovery.vercel.app](https://pluto-discovery.vercel.app)  
> **Source Code:** [https://github.com/Gopika-R-Official/PLUTO](https://github.com/Gopika-R-Official/PLUTO)

---

## Key Features

### 1. The Culture Wall & Cinematic Authentication
- **Editorial Asymmetry**: An artwork collage combining film stills, sonic vinyl archives, architectural photography, and live performance imagery.
- **Micro-Interactions**: Interactive 3D tilt, subtle grain texture, dynamic responsive depth, and directional ambient glows.
- **Fluid Auth**: Seamless tab-swapping between Sign In and Sign Up with live validation, demo account autofill, social sign-in mock bridges, and guest bypass.
- **Guest Access**: Visitors can explore the full platform freely without requiring upfront registration.

### 2. Editorial Discovery Feed
- **Curated Multi-Category Stream**: Richly formatted cinema cards, sonic vignettes, breaking world journalism, and cultural happenings.
- **Adaptive Personalization**: Client-side ranking engine that respects user topics (`#Technology`, `#Cinema`, `#Music`, `#Design`, `#Travel`, `#Lifestyle`) without algorithmic echo chambers.
- **Module Customization**: Drag-and-drop feed reorganizer with full keyboard navigation and accessible reordering.

### 3. Cinema & Box Office Radar
- **Featured Spotlight**: High-impact hero banners with trailer modals, critical ratings, release dates, and direct ticketing links.
- **Box Office Leaderboard**: Real-time critical scores, worldwide gross rankings, and interactive synopsis dialogs.

### 4. Sonic Music Architecture
- **Curated Vinyl & Track Modules**: Audio preview engine with custom Web Audio synthetic generators, wave visualizer indicators, and streaming metadata.

### 5. My Space
- **Contextual Hour Planner**: Tailor recommendations according to your current vibe, company, budget, and time of day without altering your long-term preferences.

### 6. Together Lounges
- **Collaborative Discovery**: Shared rooms with invite codes, card pinning, and real-time voting on what to watch or experience together.

### 7. Visual Atmosphere & Theming
- **Dual Aesthetic System**: Tailored light mode (warm copper, champagne, and muted coral) and deep obsidian dark mode.
- **Custom Member Avatars**: Editorial identity curation and profile synchronization.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 16.4.2](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) with Vanilla CSS custom design tokens |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Unit Testing** | [Vitest](https://vitest.dev/) with React Testing Library |
| **End-to-End Testing** | [Playwright](https://playwright.dev/) |
| **Hosting** | [Vercel](https://vercel.com/) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gopika-R-Official/PLUTO.git
   cd PLUTO
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

All environment variables are optional. The platform works out-of-the-box with bundled editorial sample data, BBC live RSS feeds, and demo credentials.

If you wish to configure live external APIs, create a `.env.local` file in the root directory:

```bash
# Optional: The Movie Database (TMDB) API credentials
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
TMDB_API_KEY=your_tmdb_api_key_here

# Optional: Custom session signing secret (defaults to internal development key)
AUTH_SECRET=your_custom_secret_key_here
```

> **Security Note:** All `.env*` files are strictly excluded from version control via `.gitignore`. Never commit API keys, tokens, or personal secrets to GitHub.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles the production build and generates static/dynamic routes |
| `npm start` | Runs the production server locally |
| `npm run lint` | Runs ESLint checks |
| `npm test` | Executes all 53 Vitest unit and integration tests |
| `npm run test:e2e` | Runs Playwright end-to-end tests in headless Chromium |

---

## Security & Privacy Policy

- **No Secrets in Source Control**: All environment variable configurations (`.env*`) and local user databases are explicitly gitignored.
- **Client-Side Data Storage**: User preferences, bookmarks, and guest sessions reside safely in `localStorage` and `sessionStorage`.
- **Serverless API Routes**: External integrations (TMDB, RSS feeds) are proxied through server-side Route Handlers (`src/app/api/*`) to prevent client credential exposure.

---

## License

MIT License. Designed and engineered for Pluto Cultural Discovery.
