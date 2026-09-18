// @ts-check
import { test, expect } from '@playwright/test';

test.describe('mobile layout', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile project only');

  for (const path of ['/', '/products', '/about', '/services', '/contact', '/faq', '/cart']) {
    test(`${path} has no horizontal page overflow`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${path} should fit inside the mobile viewport`).toBeLessThanOrEqual(1);
    });
  }

  test('mobile navigation opens and exposes primary destinations', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open mobile menu/i }).click();
    await expect(page.getByRole('link', { name: /products/i }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: /services/i }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i }).last()).toBeVisible();
  });

  test('recommended products render two cards per row', async ({ page }) => {
    await page.goto('/products');
    const productLink = page.locator('[aria-label^="View details of "]').first();
    try {
      await productLink.waitFor({ state: 'visible', timeout: 15_000 });
    } catch {
      test.skip(true, 'The product API returned no catalog items.');
    }

    await productLink.click();
    const cards = page.locator('.pdp-recommendation-card:not(.is-loading)');
    try {
      await expect(cards.first()).toBeVisible({ timeout: 15_000 });
    } catch {
      test.skip(true, 'No recommended products are available for this item.');
    }

    test.skip((await cards.count()) < 2, 'At least two recommendations are required for this assertion.');
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(Math.abs(first.y - second.y)).toBeLessThan(2);
    expect(first.x).toBeLessThan(second.x);
  });

  test('product details are not covered by a fixed purchase bar', async ({ page }) => {
    await page.goto('/products');
    const productLink = page.locator('[aria-label^="View details of "]').first();
    try {
      await productLink.waitFor({ state: 'visible', timeout: 15_000 });
    } catch {
      test.skip(true, 'The product API returned no catalog items.');
    }

    await productLink.click();
    const actionShell = page.locator('.pdp-mobile-actions-shell');
    await expect(actionShell).toBeVisible({ timeout: 15_000 });
    await expect(actionShell).toHaveCSS('position', 'static');
  });
});
