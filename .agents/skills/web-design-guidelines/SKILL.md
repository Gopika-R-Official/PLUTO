---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Checks accessibility, focus management, keyboard navigation, touch targets, contrast, typographic details, and performance best practices.
license: MIT
author: vercel
---

# Web Interface Guidelines (Vercel Labs)

Curated rules and best practices for modern web user interfaces.

## 1. Interactions & Accessibility
- **Keyboard works everywhere**: All interactive flows must be operable via keyboard (`Enter`, `Space`, `Tab`, `Escape`).
- **Focus visibility**: Every focusable element shows a visible, high-contrast `:focus-visible` ring.
- **Touch & Hit Targets**: Minimum 24px on desktop; minimum 44px on mobile devices.
- **Mobile Input Size**: `<input>` font size must be >= 16px (or `text-base`) to avoid iOS Safari auto-zoom.
- **Links are Links**: Use `<a>` or Next.js `<Link>` for navigation; do not use `<button>` or `<div>` with `onClick` for routing.
- **State in URL**: Filter, tab, search, and page state should sync with URL query params where appropriate.

## 2. Animations & Transitions
- **Respect prefers-reduced-motion**: Honor `@media (prefers-reduced-motion: reduce)`.
- **Never `transition: all`**: Explicitly specify animated properties (`transform`, `opacity`, `colors`).
- **Compositor-friendly**: Animate `transform` and `opacity` rather than properties triggering layout reflow.

## 3. Layout & Content
- **Stable skeletons**: Loading placeholders must mirror final element dimensions to eliminate layout shifts (CLS = 0).
- **Tabular numbers**: Use `tabular-nums` for timers, counts, statistics, and numeric data comparison.
- **No dead ends**: Provide clear empty states, error fallbacks, and recovery actions.
