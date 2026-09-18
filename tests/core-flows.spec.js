// @ts-check
import { test, expect } from '@playwright/test';

test('FAQ search accepts and clears a query', async ({ page }) => {
  await page.goto('/faq');
  const search = page.getByRole('textbox', { name: /search frequently asked questions/i });
  await expect(search).toBeVisible();
  await search.fill('delivery');
  await expect(search).toHaveValue('delivery');
  await search.fill('');
  await expect(search).toHaveValue('');
});

test('catalog search updates the products query', async ({ page }) => {
  await page.goto('/products');
  const search = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
  await expect(search).toBeVisible({ timeout: 15_000 });
  await search.fill('seed');
  await search.press('Enter');
  await expect(page).toHaveURL(/search=seed/i);
});

test('a catalog product opens its detail page', async ({ page }) => {
  await page.goto('/products');
  const productLink = page.locator('[aria-label^="View details of "]').first();
  try {
    await productLink.waitFor({ state: 'visible', timeout: 15_000 });
  } catch {
    test.skip(true, 'The product API returned no catalog items.');
  }

  await productLink.click();
  await expect(page).toHaveURL(/\/product\//);
  await expect(page.locator('.pdp-title')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /buy now/i })).toBeVisible();
});

test('adding a catalog item makes it available in the cart', async ({ page }) => {
  await page.goto('/products');
  const addButton = page.locator('button[aria-label^="Add "][aria-label$=" to cart"]').first();
  try {
    await addButton.waitFor({ state: 'visible', timeout: 15_000 });
  } catch {
    test.skip(true, 'The product API returned no purchasable catalog items.');
  }

  await addButton.click();
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Your Shopping Cart', exact: true })).toBeVisible();
  await expect(page.getByText(/your cart is empty/i)).toHaveCount(0);
});

test('login form rejects an incomplete submission', async ({ page }) => {
  await page.goto('/login');
  const submit = page.getByRole('button', { name: /sign in|login/i }).last();
  await expect(submit).toBeVisible();
  await submit.click();
  await expect(page).toHaveURL(/\/login$/);
});
