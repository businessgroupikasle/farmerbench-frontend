// @ts-check
import { test, expect } from '@playwright/test';

test.use({ video: 'off' });
test.setTimeout(60_000);

const CATEGORIES = [
  { id: 'cat-org', name: 'Organic Farming', slug: 'organic-farming', isActive: true, sortOrder: 1, subcategories: [], _count: { products: 4 } },
  { id: 'cat-seed', name: 'Seedlings', slug: 'seedlings', isActive: true, sortOrder: 2, subcategories: [], _count: { products: 12 } },
];

const ALL_PRODUCTS = [
  {
    id: 'prod-test',
    title: 'Test Product',
    slug: 'test-product',
    description: 'Discounted test agricultural product',
    price: 4,
    discountPrice: 2,
    stock: 20,
    rating: 4.8,
    numReviews: 5,
    featured: true,
    categoryId: 'cat-org',
    category: CATEGORIES[0],
    images: [],
    attributes: { showOnHomepage: true },
  },
  {
    id: 'prod-muringa',
    title: 'Muringa Seedlings',
    slug: 'muringa-seedlings',
    description: 'Healthy Muringa seedlings for high yield',
    price: 120,
    discountPrice: 95,
    stock: 30,
    rating: 4.9,
    numReviews: 12,
    featured: true,
    categoryId: 'cat-seed',
    category: CATEGORIES[1],
    images: [],
    attributes: { showOnHomepage: true },
  },
  ...Array.from({ length: 14 }, (_, idx) => ({
    id: `prod-extra-${idx + 1}`,
    title: idx < 3 ? `Organic Compost ${idx + 1}` : `Farm Seedling Pack ${idx + 1}`,
    slug: `farm-item-${idx + 1}`,
    description: 'Quality agricultural input',
    price: 200 + idx * 10,
    discountPrice: null,
    stock: 15,
    rating: 4.5,
    numReviews: 4,
    featured: false,
    categoryId: idx < 3 ? 'cat-org' : 'cat-seed',
    category: idx < 3 ? CATEGORIES[0] : CATEGORIES[1],
    images: [],
    attributes: {},
  })),
];

async function setupApiMocks(page, { authenticated = false } = {}) {
  if (authenticated) {
    await page.addInitScript(() => {
      localStorage.setItem('formerbench_auth_token', 'test-farmer-token');
    });
  }

  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const p = url.pathname.replace(/^\/api/, '');

    if (p === '/store-settings') {
      return route.fulfill({
        json: {
          success: true,
          data: { maintenanceMode: false, maintenanceMessage: '', standardShippingFee: 80, freeShippingThreshold: 5000 },
        },
      });
    }
    if (p === '/auth/me') {
      if (!authenticated) {
        return route.fulfill({ status: 401, json: { success: false, message: 'Unauthorized' } });
      }
      return route.fulfill({
        json: {
          success: true,
          data: {
            id: 'user-1',
            name: 'Ramesh Kumar',
            email: 'ramesh@example.com',
            role: 'CUSTOMER',
            phone: '9876543210',
            location: 'Coimbatore',
            crops: 'Paddy',
            emailVerified: true,
          },
        },
      });
    }
    if (p === '/categories') {
      return route.fulfill({ json: { success: true, data: CATEGORIES } });
    }
    if (p === '/hero-banners') {
      return route.fulfill({ json: { success: true, data: [] } });
    }
    if (p === '/products') {
      const categoryParam = url.searchParams.get('category');
      const searchParam = (url.searchParams.get('search') || '').trim().toLowerCase();
      const pageNum = Math.max(1, Number(url.searchParams.get('page') || 1));
      const limitNum = Math.max(1, Number(url.searchParams.get('limit') || 12));

      let filtered = ALL_PRODUCTS;
      if (categoryParam) {
        filtered = filtered.filter(
          (prod) => prod.category?.slug === categoryParam || prod.categoryId === categoryParam
        );
      }
      if (searchParam) {
        filtered = filtered.filter(
          (prod) =>
            prod.title.toLowerCase().includes(searchParam) ||
            prod.description.toLowerCase().includes(searchParam)
        );
      }

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limitNum));
      const start = (pageNum - 1) * limitNum;
      const sliced = filtered.slice(start, start + limitNum);

      return route.fulfill({
        json: {
          success: true,
          data: sliced,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
          },
        },
      });
    }
    if (p === '/orders' || p === '/service-bookings' || p === '/blogs' || p === '/market-prices' || p === '/experts') {
      return route.fulfill({ json: { success: true, data: [] } });
    }
    if (p === '/cart') {
      return route.fulfill({ json: { success: true, data: { items: [] } } });
    }
    return route.fulfill({ json: { success: true, data: [] } });
  });
}

test.describe('Catalog & Account UX Regressions', () => {
  test('category filter updates products without scrolling to header/banner', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop category pill bar behavior');
    await setupApiMocks(page);
    await page.goto('/products');

    await expect(page.getByText('Showing 12 of 16 genuine products')).toBeVisible({ timeout: 15_000 });

    const organicPill = page.locator('.fb-category-pill', { hasText: 'Organic Farming' });
    await organicPill.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 120));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(200);

    await organicPill.click();

    await expect(page).toHaveURL(/category=organic-farming/);
    await expect(page.getByText('Showing 4 of 4 genuine products')).toBeVisible();
    await page.waitForTimeout(200);

    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThanOrEqual(5);
  });

  test('pagination Next positions user at top of product listing, not header/banner', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop pagination alignment check');
    await setupApiMocks(page);
    await page.goto('/products');

    await expect(page.getByText('Showing 12 of 16 genuine products')).toBeVisible({ timeout: 15_000 });

    const nextBtn = page.getByRole('button', { name: 'Next page' });
    await nextBtn.scrollIntoViewIfNeeded();
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(600);

    await nextBtn.click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText('Showing 4 of 16 genuine products')).toBeVisible();

    await page.waitForFunction(() => {
      const el = document.getElementById('products-catalog-section');
      if (!el) return false;
      const top = el.getBoundingClientRect().top;
      return top >= 70 && top <= 120;
    });

    const catalogBox = await page.locator('#products-catalog-section').boundingBox();
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBeGreaterThan(250);
    expect(catalogBox?.y).toBeGreaterThanOrEqual(70);
    expect(catalogBox?.y).toBeLessThanOrEqual(120);
  });

  test('top profile dropdown renames Dashboard to My Profile while sidebar keeps Dashboard', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Top profile dropdown is desktop navigation');
    await setupApiMocks(page, { authenticated: true });
    await page.goto('/');

    const accountBtn = page.locator('button.agriflow-account-btn');
    await expect(accountBtn).toBeVisible({ timeout: 15_000 });
    await accountBtn.click();

    const dropdown = page.locator('.agriflow-user-menu');
    await expect(dropdown).toBeVisible();
    await expect(dropdown.getByRole('link', { name: 'My Profile' })).toBeVisible();
    await expect(dropdown.getByRole('link', { name: 'Dashboard' })).toHaveCount(0);

    await dropdown.getByRole('link', { name: 'My Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    const sidebar = page.locator('aside.fb-sidebar');
    await expect(sidebar.getByRole('button', { name: /Dashboard/ })).toBeVisible();
  });

  test('wishlist page removes View All 2 Items and shows discounted price with strikethrough original', async ({ page }) => {
    await setupApiMocks(page, { authenticated: true });
    await page.goto('/products?sort=newest');

    // Add Test Product (price 4, discountPrice 2) and Muringa Seedlings (price 120, discountPrice 95) to wishlist
    const testCard = page.locator('.fb-product-card', { hasText: 'Test Product' });
    await expect(testCard).toBeVisible({ timeout: 15_000 });
    await expect(testCard.locator('.fb-card-current-price')).toHaveText('₹2.00');
    await expect(testCard.locator('.fb-card-original-price')).toHaveText('₹4.00');
    await testCard.getByRole('button', { name: 'Wishlist' }).click();

    const muringaCard = page.locator('.fb-product-card', { hasText: 'Muringa Seedlings' });
    await muringaCard.getByRole('button', { name: 'Wishlist' }).click();

    // Check Dashboard overview still has functional "View All 2 Items" link
    await page.goto('/dashboard');
    const viewAllOverview = page.getByRole('link', { name: /View All 2 Items/i });
    await expect(viewAllOverview).toBeVisible({ timeout: 15_000 });
    await viewAllOverview.click();
    await expect(page).toHaveURL(/\/dashboard\?tab=wishlist/);

    // On Wishlist sub-page, "View All 2 Items" must NOT exist
    await expect(page.getByText('Saved Wishlist Items')).toBeVisible();
    await expect(page.getByText(/View All 2 Items/i)).toHaveCount(0);

    // Price mismatch check: Test Product should show ₹2.00 current price and ₹4.00 strikethrough
    const wishCard = page.locator('.fb-wishlist-product-card', { hasText: 'Test Product' });
    await expect(wishCard).toBeVisible();
    await expect(wishCard.locator('.fb-wishlist-price')).toHaveText('₹2.00');
    const origPrice = wishCard.locator('.fb-wishlist-original-price');
    await expect(origPrice).toHaveText('₹4.00');
    await expect(origPrice).toHaveCSS('text-decoration-line', 'line-through');
  });

  test('product search from Home navigates directly to search results without showing banner first', async ({ page, isMobile }) => {
    await setupApiMocks(page);
    await page.goto('/');

    const homeSearchInput = page.getByRole('textbox', { name: /search best selling products/i });
    await expect(homeSearchInput).toBeVisible({ timeout: 15_000 });
    await homeSearchInput.fill('Muringa Seedlings');
    await page.locator('.agriflow-products-search-btn').click();

    await expect(page).toHaveURL(/\/products\?search=Muringa%20Seedlings/);
    await expect(page.getByRole('heading', { name: 'Results for "Muringa Seedlings"' })).toBeVisible({ timeout: 15_000 });

    const matchingCard = page.locator('.fb-product-card', { hasText: 'Muringa Seedlings' });
    await expect(matchingCard).toBeVisible();

    if (!isMobile) {
      await page.waitForFunction(() => window.scrollY > 200);
      const headerBox = await page.locator('#products-catalog-section').boundingBox();
      const cardBox = await matchingCard.boundingBox();
      const viewportHeight = page.viewportSize()?.height || 720;
      expect(headerBox?.y).toBeGreaterThanOrEqual(70);
      expect(headerBox?.y).toBeLessThanOrEqual(130);
      expect(cardBox).not.toBeNull();
      expect(cardBox.y).toBeLessThan(viewportHeight);
    } else {
      // On mobile, matching product card must be visible (not hidden by category index!)
      const cardBox = await matchingCard.boundingBox();
      expect(cardBox).not.toBeNull();
    }
  });
});
