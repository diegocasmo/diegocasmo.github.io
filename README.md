# diegocasmo.github.io

Personal blog built with [Astro](https://astro.build/), deployed to GitHub Pages.

## Commands

```sh
nvm install       # Install and use the Node.js version in .nvmrc
npm ci            # Install dependencies (clean)
npm run dev       # Start dev server
npm run build     # Typecheck + build
npm run preview   # Preview production build
npm run check     # TypeScript/Astro check only
```

## Tests

```sh
npm test            # Run Playwright smoke tests against preview server
```

## Deploy

Deployment happens automatically via GitHub Actions on push to `main`.
