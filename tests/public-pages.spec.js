// @ts-check
import { test, expect } from '@playwright/test';

const publicPages = [
  ['Home', '/', /AgriEra|farming|harvest/i],
  ['About', '/about', /growing better|about|farming/i],
  ['Services', '/services', /solutions|services|farming/i],
  ['Farm development', '/services/farm-development', /farm/i],
  ['Well development', '/services/well-development', /water solutions|well/i],
  ['Drip irrigation', '/services/drip-irrigation', /right water|drip|irrigation/i],
  ['Farm consultancy', '/services/farm-consultancy', /expert guidance|consult/i],
  ['Crop doctor', '/crop-doctor', /crop/i],
  ['Products', '/products', /product|farm|agri/i],
  ['Blog', '/blog', /blog|insight|knowledge|agri/i],
  ['Contact', '/contact', /contact|grow|touch/i],
  ['Terms', '/terms', /terms/i],
  ['Shipping', '/shipping', /shipping/i],
  ['Returns', '/returns', /return/i],
  ['FAQ', '/faq', /frequently asked questions/i],
  ['Cart', '/cart', /shopping cart/i],
  ['Login', '/login', /growing|welcome|sign in|login/i],
];

test.describe('public page smoke coverage', () => {
  for (const [name, path, heading] of publicPages) {
    test(`${name} page loads`, async ({ page }) => {
      const response = await page.goto(String(path), { waitUntil: 'domcontentloaded' });
      expect(response?.ok(), `${path} should return a successful document`).toBeTruthy();
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('h1').first()).toContainText(/** @type {RegExp} */ (heading));
    });
  }
});

test.describe('routing behavior', () => {
  const aliases = [
    ['/home', '/home'],
    ['/index', '/'],
    ['/catalog', '/products'],
    ['/shop', '/products'],
    ['/faqs', '/faqs'],
    ['/services/development', '/services/farm-development'],
    ['/services/well', '/services/well-development'],
    ['/services/drip', '/services/drip-irrigation'],
    ['/services/consultancy', '/services/farm-consultancy'],
  ];

  for (const [source, destination] of aliases) {
    test(`${source} resolves correctly`, async ({ page }) => {
      await page.goto(source);
      await expect(page).toHaveURL(new RegExp(`${destination.replaceAll('/', '\\/')}/?$`));
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 15_000 });
    });
  }

  test('unknown route displays the not-found page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: /looks like this path ends here/i })).toBeVisible();
  });

  test('admin route redirects signed-out users to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login$/);
  });
});
