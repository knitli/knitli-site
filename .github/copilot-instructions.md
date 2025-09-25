# Copilot instructions for knitli-marketing

Purpose: Enable AI coding agents to be productive immediately in this repo by codifying the big picture, workflows, and project-specific conventions.

## What this repo is
- Static marketing site for Knitli Inc. (vanilla HTML/CSS/JS) under `frontend/` with Carrd-style structure and assets.
- Optimized production build written in Node (`scripts/build-optimized.js`) emits `dist/` for hosting/CDN.
- A separate, not-integrated blog starter kit lives in `starter-kit/` (Next.js/pnpm monorepo). Don’t wire it into this site unless explicitly requested.

## Build, run, deploy
- Local dev (recommended): `npm run dev` (Vite, root=`frontend/`, port 3000). Alternatives: `dev:legacy` (npx serve), `dev:python`.
- Production build (optimized path): `npm run build` → runs `scripts/build-optimized.js` and writes `dist/`.
- Vite build (fallback/alt): `npm run build:vite`; analyze with `npm run build:analyze`; preview: `npm run preview` or `preview:dist`.
- Deploy: `npm run deploy` → `wrangler pages deploy dist` to Cloudflare Pages.

## How the optimized build works (important conventions)
- HTML template: Single source of truth is `frontend/index.html`. The build reads it and replaces a literal `@import "critical.css";` token with the contents of `frontend/critical.css` to inline above-the-fold CSS.
- CSS: Main stylesheet is `frontend/assets/main.css` (Carrd-generated). The build minifies this and writes `dist/assets/main.css`.
- Assets copy: Everything under `frontend/assets/` (except `main.css`, handled separately) is copied to `dist/assets/` preserving structure.
- Lazy loading: Source file `frontend/assets/lazy-load.js` handles `.frame.deferred img[data-src]` with IntersectionObserver. The build copies it to `dist/assets/lazy-load.js`.
- Root files like `favicon.svg`, `apple-touch-icon.png`, `site.webmanifest` are copied into `dist/` when present.

## Frontend structure and patterns
- Single-page document: `frontend/index.html` is used in both dev and prod (single source). Keep the `@import "critical.css"` token inside a `<style>` tag so the build can inline it.
- Icons: Use `frontend/assets/icons.svg` sprite. Example: `<use xlink:href="assets/icons.svg#arrow-down">`.
- Images: Place optimized images in `frontend/assets/images/` (prefer WebP/AVIF). Use Carrd-style placeholders for lazy loading:
  - `src` is a tiny inline SVG placeholder, real image path in `data-src`.
  - Example snippet: `<img src="data:image/svg+xml;base64,..." data-src="assets/images/confused_robot.webp" alt="">` within `<span class="frame deferred">`.
- Analytics: PostHog is initialized inline in `index.html` (US host). Keys/host are hardcoded; changes happen in the HTML, not via env.
- Email signup: ConvertKit form is embedded directly in `index.html`. If editing, preserve data attributes/classes the remote script expects.

## Starter kit note (scoped out by default)
- `starter-kit/` contains Next.js themes and tooling (pnpm workspace). It is not used by the top-level scripts. Don’t run or modify it for this site unless asked.

## Common pitfalls (avoid regressions)
- Don’t rename `frontend/assets/main.css` or move `icons.svg`/image folders without updating `scripts/build-optimized.js` and HTML references.
- Ensure `@import "critical.css";` remains in `index.html` so the build can inline it.
- Keep asset paths relative to the page root expected by Vite (`root: 'frontend'`) and the final `dist/` structure.
- No formal tests; validate changes by running the build and using browser + Lighthouse.

## Useful references
- Build script: `scripts/build-optimized.js`
- Vite config: `vite.config.js` (root `frontend/`, minify with Terser)
- Performance doc: `README-optimizations.md`
- Background/overview: `CLAUDE.md`

Questions/clarifications welcome: if any section above doesn’t match your task or feels incomplete, ask for the specific workflow or file you need documented and we’ll iterate.
