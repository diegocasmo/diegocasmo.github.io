# diegocasmo.github.io

Personal blog by Diego Castillo. Built with Astro 5, TypeScript, vanilla CSS. Deployed to GitHub Pages.

## Philosophy & Principles

- **SEO is non-negotiable** — never degrade existing meta, Open Graph, structured data, or social sharing tags
- **Accessibility (WCAG 2.1 AA)** — semantic HTML, ARIA attributes, keyboard navigation, visible focus management
- **Mobile-first responsive design** — single breakpoint at `max-width: 684px`
- **Readability** — monospace typography (Fira Code), high contrast, generous `line-height: 1.54em`
- **Social sharing quality** — OG tags, Twitter cards, and `og:image` must always be present on every page
- **Minimal dependencies** — vanilla CSS, no frameworks, no unnecessary JS; the site is intentionally static
- **Content direction** — evolving from web dev toward systems programming, CS fundamentals, and low-level engineering

## Commands

```sh
npm ci              # Install dependencies (clean)
npm run dev         # Dev server
npm run build       # Typecheck + build (astro check && astro build)
npm run preview     # Preview production build
npm run check       # TypeScript/Astro check only
```

## Project Structure

```
src/
├── layouts/          # BaseLayout.astro, PostLayout.astro
├── components/       # Reusable Astro components
├── pages/            # File-based routing
│   ├── [...slug].astro   # Individual post pages (/{slug}/)
│   ├── page/             # Paginated listing (/page/{n}/)
│   └── tags/             # Tag listings (/tags/{tag}/)
├── content/posts/    # Markdown blog posts (content collection)
├── styles/           # terminal.css, menu.css, and other vanilla CSS
public/               # Static assets, robots.txt, fonts
```

## Content Schema

Post frontmatter (`src/content.config.ts`):

```yaml
title: string          # Required
description: string    # Required
pubDate: date          # Required
updatedDate: date      # Optional
image: string          # Optional
externalLink: string   # Optional
tags: string[]         # Default: []
draft: boolean         # Default: false — drafts are filtered from all listings
```

Slugs are date-prefix-free. Legacy redirects (date-prefixed and `/posts/` paths) are mapped in `astro.config.mjs`.

## SEO — Must Preserve

- **Canonical URLs** — generated in `BaseLayout.astro`
- **Open Graph** — `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
- **Twitter Cards** — `summary_large_image`, `twitter:creator`
- **Schema.org** — Article microdata in `PostLayout.astro` (`headline`, `datePublished`, `author`)
- **Sitemap** — `@astrojs/sitemap` at `/sitemap-index.xml`
- **RSS** — `@astrojs/rss` at `/rss.xml`
- **robots.txt** — in `public/`

## Design System

- **Aesthetic** — terminal/hacker theme: dark background (`#1c1e22`), golden accent (`#d4a857`), monospace throughout
- **CSS custom properties** — defined in `terminal.css` (`--background`, `--foreground`, `--accent`, `--radius`)
- **Vanilla CSS only** — no Tailwind, no CSS-in-JS, no preprocessors
- **Single responsive breakpoint** — `max-width: 684px`
- **Syntax highlighting** — Shiki with `tokyo-night` theme

## Code Style

- TypeScript strict mode
- Astro components (`.astro` files) — no UI framework (no React, Vue, or Svelte)
- Minimal inline JS — static site, keep it static

## Git & Deploy

- **Deploy**: GitHub Actions on push to `main` → `withastro/action@v3` → GitHub Pages
- **Build pipeline**: runs `astro check` before `astro build`

## Boundaries

- **Do not** add UI frameworks (React, Vue, Svelte) — the blog is intentionally framework-free
- **Do not** add CSS frameworks or preprocessors
- **Do not** modify redirect mappings in `astro.config.mjs` without understanding the legacy URL structure
- **Do not** remove or weaken any SEO meta tags, structured data, or social sharing tags
