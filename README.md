# Dashboard Design System

Storybook component library and screen documentation for the **CometChat Dashboard**.

Built with **React 18 + Vite + TypeScript + Storybook 10**. Everything is driven by design tokens generated from Figma — no hardcoded colours, spacing, or type.

📖 **Live Storybook:** https://pradeep-cometchat.github.io/Dashboard-Design-System/

## What's inside

- **Foundations** — design tokens (colours, typography, spacing, radius, elevation, moderation) generated from `src/assets/design-tokens.scss` into `src/foundations/tokens.ts` + `tokens.css`.
- **Base Components** — 32 `CometChat*` components (Avatar, Badge, Button, Input, Modal, Tabs, …) mirrored from the dashboard codebase, each with stories + autodocs.
- **Screens** — the **Conversation Explorer** feature (1:1 and Group flows) assembled entirely from the base components and foundation tokens, with an Overview doc page and per-state stories.

## Getting started

```bash
npm install
npm run storybook      # dev server on http://localhost:6006
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run storybook` | Start the Storybook dev server |
| `npm run build-storybook` | Build the static Storybook (deployed to GitHub Pages) |
| `npm run dev` | Vite dev server |
| `node scripts/generate-tokens.mjs` | Regenerate `tokens.ts` / `tokens.css` from `design-tokens.scss` |

## Design tokens

Tokens are the single source of truth. To change them, edit `src/assets/design-tokens.scss` and run:

```bash
node scripts/generate-tokens.mjs
```

This regenerates the typed token module and the CSS custom-properties layer consumed across the library.

## Deployment

Every push to `main` builds the static Storybook and publishes it to GitHub Pages via `.github/workflows/deploy-storybook.yml`.
