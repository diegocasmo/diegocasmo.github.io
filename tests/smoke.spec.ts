import { test, expect } from '@playwright/test';

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
  await expect(page.locator('a[href="/resume.pdf"]')).toBeVisible();
  // Inline links keep their surrounding spaces (Astro whitespace regression guard)
  await expect(page.locator('.page')).toContainText('Senior Software Engineer at Buffer');
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
