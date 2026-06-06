# AGENTS.md

## Cursor Cloud specific instructions

### Product

Static marketing site for [application-pal](https://github.com/Doebele/application-pal) (Astro 4, `output: 'static'`). The actual job-tracker app lives in a separate repo and is **not** part of this workspace.

### Services

| Service | Command | URL |
|---------|---------|-----|
| Dev (hot reload) | `npm run dev` | http://localhost:4321/application-pal-website/ |
| Production-like preview | `npm run build` then `npm run preview` | same base path |

No database, Docker, or `.env` is required for this repo.

### Node

CI uses **Node 20** (see `.github/workflows/deploy.yml`). Node 22 also works for local dev.

### Base path

`astro.config.mjs` sets `base: '/application-pal-website'`. Always use that prefix when curling or opening pages locally (not `/` alone).

### Lint / tests

There are no `lint` or `test` scripts in `package.json`. Validation is `npm run build` (matches GitHub Pages deploy).

### Gotchas

- `npm run preview` serves the **built** `dist/` folder; run `npm run build` first after pulling changes that affect pages.
- `npm run dev` does not require a prior build.
- For long-running servers in Cloud Agent VMs, use **tmux** (e.g. session `astro-dev` or `astro-preview`).
