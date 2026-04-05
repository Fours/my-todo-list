# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test runner is configured.

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js`, configured in CSS)
- **react-icons v5** for icons
- Entry: `src/main.tsx` → `src/App.tsx`

## Design System

This project follows the Airbnb design system (documented in `DESIGN.md`). Key rules:

- **Colors**: Pure white (`#ffffff`) background, near-black (`#222222`) text, Rausch Red (`#ff385c`) as the sole brand accent (CTAs only)
- **Font**: Airbnb Cereal VF (weight 500–700 only; no weights below 500 for any heading)
- **Shadows**: Always use the three-layer card shadow: `rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px`
- **Border radius**: 8px buttons, 14px badges, 20px cards, 32px large elements, 50% circular controls
- **Spacing**: 8px base unit
- **Typography**: Negative letter-spacing on headings (-0.18px to -0.44px); use `--palette-*` CSS tokens
