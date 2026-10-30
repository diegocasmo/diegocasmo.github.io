import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

test('homepage loads with posts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('article.post.on-list').first()).toBeVisible();
  await expect(page.locator('a.read-more').first()).toBeVisible();
});

test('blog post renders content', async ({ page }) => {
  await page.goto('/fft/');
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('h1.post-title')).toBeVisible();
  await expect(page.locator('.post-content')).toBeVisible();
  // BlogPosting JSON-LD is present
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(jsonLd).toContain('BlogPosting');
});

test('blog post exposes a Markdown variant', async ({ request, page }) => {
  await page.goto('/fft/');
  const alternate = page.locator('link[rel="alternate"][type="text/markdown"]');
  await expect(alternate).toHaveCount(1);
  const response = await request.get('/fft.md');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain('title: ');
});

test('llms.txt lists posts as Markdown', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain('# Diego Castillo');
  expect(body).toContain('.md)');
});

test('RSS feed is valid XML', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain('<channel>');
  expect(body).toContain('<item>');
});

test('pagination page 2 loads', async ({ page }) => {
  await page.goto('/page/2/');
  await expect(page.locator('article.post.on-list').first()).toBeVisible();
  await expect(page.locator('a.button.prev')).toBeVisible();
});

test('tags index lists tags', async ({ page }) => {
  await page.goto('/tags/');
  await expect(page.locator('h1')).toContainText('Tags');
  await expect(page.locator('a.tag-item').first()).toBeVisible();
});

test('merge-sort animations render and controls work', async ({ page }) => {
  await page.goto('/merge-sort/');
  // Animation container renders
  await expect(page.locator('.algo-viz').first()).toBeVisible();
  // Toggle button shows "Play" initially
  const toggle = page.locator('.algo-viz__toggle').first();
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveText('Play');
  // Click play, button changes to "Pause"
  await toggle.click();
  await expect(toggle).toHaveText('Pause');
  // SEO preserved: BlogPosting JSON-LD present
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(jsonLd).toContain('BlogPosting');
});

test('about page renders with ProfilePage JSON-LD', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('h1')).toContainText('About');
  await expect(page.locator('a[href="/resume.md"]')).toBeVisible();
  // Inline links keep their surrounding spaces (Astro whitespace regression guard)
  await expect(page.locator('.page')).toContainText(
    'team @buffer.com building'
  );
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(jsonLd).toContain('ProfilePage');
});

test('individual tag page shows posts', async ({ page }) => {
  await page.goto('/tags/');
  const firstTag = page.locator('a.tag-item').first();
  await firstTag.click();
  await expect(page.locator('article.post.on-list').first()).toBeVisible();
});

test('plain .md posts are mirrored byte-for-byte', async ({ request }) => {
  const source = readFileSync('src/content/posts/fft.md', 'utf8');
  const sourceBody = source.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  const response = await request.get('/fft.md');
  expect(await response.text()).toContain(sourceBody);
});

test('.mdx mirrors have no MDX syntax left', async ({ request }) => {
  const response = await request.get('/merge-sort.md');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).not.toMatch(/^\s*(import|export)\s/m);
  expect(body).not.toMatch(/<\/?[A-Z][^>]*>/);
});

// Drafts are only filtered in getPublishedPosts(); any other caller can leak them.
test('only src/data/posts.ts reads the posts collection', () => {
  const offenders = readdirSync('src', { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.(astro|ts|js|mjs)$/.test(file))
    .filter((file) => file !== join('data', 'posts.ts'))
    .filter((file) =>
      readFileSync(join('src', file), 'utf8').includes('getCollection(')
    );
  expect(offenders).toEqual([]);
});
