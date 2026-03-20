import { test, expect } from '@playwright/test';

test('homepage loads with posts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('article.post.on-list').first()).toBeVisible();
  await expect(page.locator('a.read-more').first()).toBeVisible();
});

test('blog post renders content', async ({ page }) => {
  await page.goto('/fft/');
  await expect(
    page.locator('article[itemtype="http://schema.org/Article"]'),
  ).toBeVisible();
  await expect(page.locator('h1.post-title')).toBeVisible();
  await expect(page.locator('.post-content')).toBeVisible();
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

test('individual tag page shows posts', async ({ page }) => {
  await page.goto('/tags/');
  const firstTag = page.locator('a.tag-item').first();
  await firstTag.click();
  await expect(page.locator('article.post.on-list').first()).toBeVisible();
});
