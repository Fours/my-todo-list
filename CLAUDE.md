# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App Overview

A multi-list todo app. Users can create named todo lists, add items to each list, mark items done (strikethrough), delete items, and rename todo lists. All data is persisted to `localStorage` under the key `todo-lists`.

### Data model
```typescript
interface TodoItem { id: string; text: string; done: boolean }
interface TodoList  { id: string; name: string; items: TodoItem[]; createdAt: number }
```

### Component tree
```
App.tsx              — state owner; reads/writes localStorage; renders two-panel layout
  Sidebar.tsx        — list navigator; inline "New List" form (Enter to confirm, Escape to cancel)
  ListDetail.tsx     — selected list; add-item input (Enter to add); remaining-item count
    TodoItem.tsx     — circular done-toggle, strikethrough text, hover-reveal trash button
```

### Key behaviors
- Selecting a list in the sidebar updates `selectedId` in `App`; the selected list is highlighted in Rausch Red
- The sidebar shows a per-list count of remaining (not-done) items; hidden when count is 0
- Delete buttons on both list rows and todo items are hidden until hover
- `App.css` owns all CSS via custom properties (`--color-*`, `--shadow-*`, `--radius-*`, `--font`); Tailwind is imported in `index.css` but not used for component styles

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
