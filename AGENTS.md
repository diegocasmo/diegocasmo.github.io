# diegocasmo.github.io

Personal blog by Diego Castillo: Astro, TypeScript, vanilla CSS, static output deployed to GitHub Pages.

> `CLAUDE.md` is a symlink to this file. Edit here.

This file holds only what the code can't tell you: rules, the reasons behind them, and gotchas. Read the code for everything else (`package.json`, `src/content.config.ts`, `.github/`, `src/styles/terminal.css`).

## Setup and verification

```sh
nvm install                      # Node version from .nvmrc (Astro needs a recent Node 22)
npm ci
npx playwright install chromium  # again whenever Playwright is updated
npm run format                   # Prettier; CI runs format:check
npm run build                    # astro check + astro build
npm test                         # Playwright smoke tests against `npm run preview`
```

- Run `npm run build` before `npm test`. Preview serves `dist/` as-is, so a stale build gives stale results.
- Locally, Playwright reuses any server already on port 4321 (`playwright.config.ts`). Stop stray dev/preview servers first or you test the wrong thing.
- CI (`ci.yml`) runs format check, build, and tests on PRs. Deploy (`deploy.yml`) runs on push to `main` and does **not** wait for CI. That is intentional for this repo; don't "fix" it.

## Principles

- **Static and dependency-light.** No UI frameworks (React, Vue, Svelte), no CSS frameworks or preprocessors, no JS animation libraries, minimal inline JS.
- **SEO is non-negotiable.** Never remove or weaken canonical, Open Graph, Twitter card, or JSON-LD output (`BaseLayout.astro`, `PostLayout.astro`). JSON-LD is the only structured-data format; don't reintroduce microdata. `twitter:site` and `twitter:creator` must include the `@`.
- **Accessibility (WCAG 2.1 AA).** Semantic HTML, keyboard access, visible focus.
- **Mobile-first, one breakpoint:** `max-width: 684px` (plus `@media print`). Use the CSS custom properties in `terminal.css`, not literal colors.
- **Content direction:** software craftsmanship, building with AI, CS fundamentals, and building products.
- **Agent experience.** `/llms.txt`, `/llms-full.txt`, `/{slug}.md`, and `/resume.md` make the site machine-readable. Keep them generated, never hand-maintained.

## Invariants and gotchas

- **Use `getPublishedPosts()` (`src/data/posts.ts`) for every post listing, feed, or agent route.** It removes drafts and sorts by date. Calling `getCollection('posts')` anywhere else can leak drafts; a test enforces this.
- **`.md` mirrors and `/llms-full.txt` skip `externalLink` posts.**
- **Person facts (job title, employer, `sameAs`) live in `src/data/person.ts`.** Both the homepage and `/about` use it with the same `#person` `@id`. Visible prose on `/about` and in `src/data/resume.md` needs a separate update.
- **The filename is the URL slug** (`/{filename}/`, no date prefix). Renaming a post breaks inbound links unless you add a redirect in `astro.config.mjs`. Never remove existing redirects; they keep legacy date-prefixed and `/posts/` URLs alive.
- **Don't reformat files in `src/content/`.** Prettier skips them on purpose so published posts stay byte-identical.
- **OG images** are rendered at build time with satori (`src/pages/og/`, `src/utils/og.ts`). They don't load the site stylesheet, so `og.ts` repeats the site colors: change both together. The `image` frontmatter field overrides the OG image and also renders as the post's hero image.
- **`.mdx` mirrors go through `cleanMdx`** (`src/utils/markdown.ts`), which drops every line starting with `import`/`export`, even inside code fences. Check the `.md` mirror before converting a code-heavy post to `.mdx`.
- **Keep the `{' '}` around inline links that span lines in `.astro` files** (see `about.astro`). Without it the words on either side run together; a smoke test guards `/about`.
- **External links** use `target="_blank" rel="noopener"`; internal links (`/...`) use neither.

## Animations

Interactive algorithm visualizations live in `src/components/animations/` and are used from `.mdx` posts (see `merge-sort.mdx`). Pure CSS keyframes only, always wrapped in `AlgoViz.astro`, which provides the controls and accessibility. The authoring recipe is in the header comment of `AlgoViz.astro`. The stage is `aria-hidden`, and `.md` mirrors strip components, so explain the algorithm in the post's prose, not only inside the animation.
