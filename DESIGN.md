# Pluto Design System (DESIGN.md)

> **Version**: 3.0.0  
> **Creative Direction**: Anti-Generic Art-Directed Editorial Hub & Cinematic Discovery Platform  
> **Frameworks**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion  
> **Design References**: Taste Skill (`design-taste-frontend`), React Bits Component Patterns, Vercel Web Interface Guidelines  
> **Workspace Root**: `D:\Pluto`

---

## 1. Executive Creative Philosophy: No More Generic Dashboards

Pluto is designed not as a sterile SaaS dashboard or a repeating 3-column template, but as a **high-end interactive editorial world** for discovering culture, entertainment, cinema, music, dining, and ideas.

### The Five Core Tenets

1. **The Idea Comes From The Subject (Cinematic & Cultural Depth)**
   - Reject arbitrary purple gradients, floating glass boxes over empty voids, and repetitive card templates.
   - Deep, tangible surfaces: Cosmic Obsidian (`#090a10`) in Dark Mode; Warm Editorial Porcelain (`#f8fafc`) with Slate 900 typography in Light Mode.
   - Dynamic specular lighting, fine-pointer cursor spotlights, and physical bevels (`inset 0 1px 0 var(--border-rim)`).

2. **Substance Over Restraint (Anti-Slop Art Direction)**
   - Confident typographic scale hierarchy. Headlines strictly kept under **two lines** (~32–40 characters) across all viewports.
   - Varied visual rhythm: combine dominant full-bleed cinematic hero stages, kinetic horizontal rails, polymorphic editorial dispatches, and gatefold vinyl album sleeves.
   - Authentic content only: no mismatched placeholder imagery (e.g. game controllers on Dune or classical music).

3. **Live Tactile Mechanisms (React Bits Motion Patterns)**
   - **SpotlightCard**: Cursor-following radial illumination on desktop fine-pointer devices.
   - **TiltedCard**: Physical 3D spring tilt with specular sheen glare on hover (stops over clickable buttons to prevent missed taps).
   - **MagneticButton**: Subtle magnetic pull toward cursor for primary CTAs (`Watch Trailer`, `Play Preview`, `Book Tickets`).
   - **Kinetic Rails**: Horizontal inertial scrolling with visible navigation buttons, drag support, and edge-fade masks.
   - **Interactive 3D Turntable Vinyl**: Physical vinyl record emerges from sleeve and spins during audio playback with live waveform visualizer.

4. **Dedicated Route Identifies (Zero Copy-Paste Layouts)**
   - **Home (`/`)**: Personalized starting point with greeting, dominant cinema spotlight, cultural pulse column, mixed-content curation, and kinetic rails.
   - **Discover (`/discover`)**: Immersive intention and mood space. Selecting an intention (`Unwind`, `Cinema Night`, `Sonic Journey`, `Culinary Sanctuary`, `Curiosity`, `Adventurous Outings`) fundamentally re-architects the stage, content, and available actions.
   - **Music (`/music`)**: Purpose-built listening vault containing music only. No profile widgets or generic feed clutter.
   - **My Space (`/my-space`)**: Personal library for curated shelves, saved bookmarks across domains, and session history.

5. **Accessibility as a First Principle (Vercel Guidelines)**
   - Full keyboard accessibility (`Enter`, `Space`, `Tab`, `Escape`).
   - High-contrast `:focus-visible` ring with 2px or 3px offset.
   - Mobile touch targets strictly >= 44px.
   - Inputs >= 16px to prevent iOS Safari auto-zoom.
   - Native `<a>` and Next.js `<Link>` for all navigable routes.
   - Full `@media (prefers-reduced-motion: reduce)` compliance.

---

## 2. Color Tokens & Theme Foundation

### Semantic Color Matrix

| Token | Light Theme | Dark Theme | Role & Semantic Application |
| :--- | :--- | :--- | :--- |
| `--bg` | `#f8fafc` (Slate 50) | `#090a10` (Cosmic Obsidian) | Canvas foundation |
| `--fg` | `#0f172a` (Slate 900) | `#f8fafc` (Porcelain White) | Primary typography & iconography |
| `--muted` | `#64748b` (Slate 500) | `#94a3b8` (Slate 400) | Metadata, dates, source tags |
| `--card` | `#ffffff` (Pure White) | `#0c101d` (Deep Obsidian Glass) | Elevated surface container |
| `--card-strong`| `#f1f5f9` (Slate 100) | `#161926` (Midnight Card) | Hovered/selected card surface |
| `--border` | `rgba(15,23,42,0.08)` | `rgba(255,255,255,0.08)` | Boundary outline |
| `--border-rim` | `rgba(255,255,255,0.9)` | `rgba(255,255,255,0.14)`| Beveled inner highlight line |
| `--theme-accent` | `#2563eb` (Cobalt 600) | `#3b82f6` (Cobalt 500) | Primary actions, play buttons |
| `--theme-accent-hover` | `#1d4ed8` | `#60a5fa` | Hover state on action buttons |
| `--theme-accent-glow` | `rgba(37,99,235,0.18)` | `rgba(59,130,246,0.3)` | Radial spotlight glow |

### Functional Accents
- **Cinema / Gold**: `--amber` (`#f59e0b`) — TMDB ratings, awards, spotlight badges.
- **Soundstage / Vinyl**: `--pink` (`#ec4899`) / `--purple` (`#a855f7`) — Audio players, vinyl spinning indicators.
- **Gastronomy / Table**: `--emerald` (`#10b981`) — Michelin ratings, reservation concierge.
- **Dispatches / Intelligence**: `--indigo` (`#6366f1`) — Breaking news and technological monographs.

---

## 3. Typographic Scale & Hierarchy

- **Font Family**: Geist Sans (`var(--font-geist-sans), system-ui, sans-serif`) with Newsreader serif accents where appropriate.
- **Tabular Numerics**: `tabular-nums` applied on scores, dates, ratings, and audio durations.

| Hierarchy | Size (Desktop / Mobile) | Weight | Line Height | Tracking | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 48px – 36px | 800 (Extrabold) | 1.1 | `-0.04em` | Page banner, Stage headline |
| **Section Title (H2)**| 28px – 22px | 700 (Bold) | 1.2 | `-0.03em` | Rail headings, collection shelves |
| **Card Heading (H3)** | 18px – 16px | 600 (Semibold) | 1.3 | `-0.02em` | Movie titles, track names (max 2 lines) |
| **Body / Summary** | 14px – 13px | 400 – 500 | 1.5 | `-0.01em` | Descriptions, article snippets |
| **Micro / Metadata** | 11px – 10px | 600 (Bold) | 1.4 | `+0.02em` | Badges, timestamps, duration |

---

## 4. Component Layout Archetypes

### 1. Asymmetric Hero Stage (`Cinematic3DStage` / `HomeView`)
- Split 7:5 ratio on desktop; stacked on mobile.
- Left: Full-bleed cinematic card with TMDB backdrop, trailer play trigger, and ticket booking.
- Right: Velocity-ranked cultural trend dispatches with artwork, rank numbers, and quick access.

### 2. Mood & Intention Compass (`DiscoverExplorationView`)
- Integrated 7-card intention selector:
  - *Unwind & Tranquility*
  - *Cinema Night*
  - *Sonic Journey*
  - *Culinary Sanctuary*
  - *Curiosity & Science*
  - *Adventurous Outings*
  - *Destination Wayfaring*
- Dynamically transforms stage image, description, and available actions (Book Table, Watch Trailer, Play Preview, Read Story).

### 3. Hi-Fi Turntable & Vinyl Vault (`MusicView`)
- Purpose-built for music only.
- 3D interactive spinning vinyl record with live soundwave visualizer.
- Gatefold album cards, genre archives, and themed listening rooms.

### 4. Personal Sanctuary Archive (`MySpaceView`)
- Curated collection shelves with custom creation and deletion.
- Multi-domain saved archive (Cinema, Dispatches, Vinyl, Dining).
- Session exploration footprint.

---

## 5. Motion & Interaction Specifications

1. **Compositor Accelerated Only**:
   - Only animate `transform` and `opacity`.
   - Never animate `width`, `height`, `margin`, or `padding`.

2. **Transitions & Curves**:
   - Hover and tap transitions: `150ms – 250ms` using `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Modals and drawers: `300ms – 400ms` ease-out.

3. **Reduced Motion**:
   - When `@media (prefers-reduced-motion: reduce)` matches, transforms are disabled, durations set to `0.01ms`, and card tilt is locked to flat.

---

## 6. Verification Checklist

- [x] Zero generic 3-column card grids.
- [x] Zero gamepad images for cinema or music.
- [x] Sidebar links Music to `/music` and My Space to `/my-space`.
- [x] Discover contains full intention & mood exploration.
- [x] Music contains music only (no profile or generic mood widgets).
- [x] My Space is a personal library (no feed widgets).
- [x] Real TMDB trailer playback, movie booking, and restaurant reservations preserved.
- [x] Light and dark modes meticulously designed.
- [x] All unit, integration, and lint checks pass cleanly.
