// @ts-check
import { test, expect } from '@playwright/test';

test.use({ video: 'off' });
test.setTimeout(60_000);

const MOCK_CATEGORIES = [
  { id: 'cat-bio', name: 'Bio-Fertilizers', slug: 'bio-fertilizers', isActive: true, sortOrder: 1, subcategories: [] },
];

const ZERO_REVIEW_PRODUCT = {
  id: 'prod-zero',
  title: 'Zero Review Bio Item',
  slug: 'zero-review-bio-item',
  description: 'Pure biological culture without any reviews yet',
  price: 350,
  discountPrice: null,
  stock: 25,
  rating: 0,
  numReviews: 0,
  featured: true,
  categoryId: 'cat-bio',
  category: MOCK_CATEGORIES[0],
  images: [],
  attributes: { showOnHomepage: true },
};

async function setupMocks(page, { authenticated = false, isAdmin = false } = {}) {
  if (authenticated) {
    await page.addInitScript(() => {
      localStorage.setItem('formerbench_auth_token', 'test-token-xyz');
    });
  }

  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const p = url.pathname.replace(/^\/api/, '');

    if (p === '/store-settings' || p === '/admin/store-settings') {
      if (route.request().method() === 'PUT') {
        const body = route.request().postDataJSON();
        return route.fulfill({
          json: {
            success: true,
            data: {
              maintenanceMode: body.maintenanceMode ?? true,
              maintenanceMessage: 'We are making improvements.',
              standardShippingFee: body.standardShippingFee ?? 80,
              freeShippingThreshold: body.freeShippingThreshold ?? 5000,
            },
          },
        });
      }
      return route.fulfill({
        json: {
          success: true,
          data: { maintenanceMode: false, maintenanceMessage: '', standardShippingFee: 80, freeShippingThreshold: 5000 },
        },
      });
    }

    if (p === '/auth/me') {
      if (!authenticated) return route.fulfill({ status: 401, json: { success: false } });
      return route.fulfill({
        json: {
          success: true,
          data: {
            id: 'user-test',
            name: 'Karthik Raja',
            email: 'karthik@example.com',
            role: isAdmin ? 'ADMIN' : 'CUSTOMER',
            phone: '9876543210',
            location: 'Salem',
            crops: 'Cotton',
          },
        },
      });
    }

    if (p === '/categories') {
      return route.fulfill({ json: { success: true, data: MOCK_CATEGORIES } });
    }

    if (p === '/hero-banners') {
      return route.fulfill({ json: { success: true, data: [] } });
    }

    if (p === '/products') {
      return route.fulfill({
        json: {
          success: true,
          data: [ZERO_REVIEW_PRODUCT],
          pagination: { page: 1, limit: 12, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
        },
      });
    }

    if (p.startsWith('/products/')) {
      return route.fulfill({ json: { success: true, data: ZERO_REVIEW_PRODUCT } });
    }

    if (p === '/orders/my-orders') {
      return route.fulfill({
        json: {
          success: true,
          data: [
            {
              id: 'ord-pending-12345678',
              orderStatus: 'PENDING',
              paymentMethod: 'CASH_ON_DELIVERY',
              paymentStatus: 'PENDING',
              totalPrice: 430,
              itemsPrice: 350,
              shippingPrice: 80,
              createdAt: new Date().toISOString(),
              items: [{ id: 'item-1', title: 'Zero Review Bio Item', price: 350, quantity: 1 }],
            },
            {
              id: 'ord-delivered-87654321',
              orderStatus: 'DELIVERED',
              paymentMethod: 'RAZORPAY',
              paymentStatus: 'PAID',
              totalPrice: 430,
              itemsPrice: 350,
              shippingPrice: 80,
              createdAt: new Date().toISOString(),
              items: [{ id: 'item-2', title: 'Zero Review Bio Item', price: 350, quantity: 1 }],
            },
            {
              id: 'ord-cancelled-prepaid-999',
              orderStatus: 'CANCELLED',
              paymentMethod: 'RAZORPAY',
              paymentStatus: 'REFUNDED',
              totalPrice: 500,
              itemsPrice: 500,
              shippingPrice: 0,
              createdAt: new Date().toISOString(),
              items: [{ id: 'item-3', title: 'Bio Item', price: 500, quantity: 1 }],
            },
          ],
        },
      });
    }

    if (p.endsWith('/cancel')) {
      return route.fulfill({
        json: { success: true, message: 'Order cancelled successfully', data: { orderStatus: 'CANCELLED' } },
      });
    }

    if (p.endsWith('/exchange')) {
      return route.fulfill({
        json: { success: true, message: 'Exchange request submitted successfully' },
      });
    }

    if (p === '/orders' || p === '/admin/orders') {
      return route.fulfill({
        json: {
          success: true,
          data: {
            orders: [
              {
                id: 'ord-cancelled-prepaid-999',
                orderStatus: 'CANCELLED',
                paymentMethod: 'RAZORPAY',
                paymentStatus: 'PAID',
                totalPrice: 750,
                itemsPrice: 750,
                createdAt: new Date().toISOString(),
                user: { name: 'Karthik Raja', email: 'karthik@example.com', phone: '9876543210' },
                items: [{ id: 'item-1', title: 'Bio Item', price: 750, quantity: 1 }],
              },
            ],
            total: 1,
            totalPages: 1,
          },
        },
      });
    }

    if (p.endsWith('/refund')) {
      return route.fulfill({
        json: {
          success: true,
          message: 'Refund processed successfully',
          data: { paymentStatus: 'REFUNDED' },
        },
      });
    }

    if (p === '/admin/coupons' && route.request().method() === 'POST') {
      const b = route.request().postDataJSON();
      return route.fulfill({
        status: 201,
        json: {
          success: true,
          data: { id: 'coup-new', code: b.code, discountType: b.discountType, discountValue: b.discountValue },
        },
      });
    }

    if (p === '/admin/analytics') {
      return route.fulfill({
        json: {
          success: true,
          data: { totalRevenue: 10000, totalOrders: 5, totalCustomers: 12, totalProducts: 8 },
        },
      });
    }

    return route.fulfill({ json: { success: true, data: [] } });
  });
}

test.describe('Batch 2 Feature & Functional Regressions', () => {
  test('ratings and reviews display accurate backend values without fake 4.6 or 18 reviews', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/products?category=bio-fertilizers');

    const card = page.locator('.fb-product-card', { hasText: 'Zero Review Bio Item' });
    await expect(card).toBeVisible({ timeout: 15_000 });

    // Must NOT contain fake hardcoded 4.6 or 18
    await expect(card.locator('.fb-card-rating-value')).toHaveText('0.0');
    await expect(card.locator('.fb-card-reviews-count')).toHaveText('(No Reviews)');
    await expect(card.getByText('4.6')).toHaveCount(0);
    await expect(card.getByText('(18)')).toHaveCount(0);
  });

  test('customer orders view provides Cancel Order on pending, Request Exchange on delivered, and tracks refund status', async ({ page }) => {
    await setupMocks(page, { authenticated: true });
    await page.goto('/dashboard?tab=orders');

    await expect(page.getByText('My Orders (3)')).toBeVisible({ timeout: 15_000 });

    // 1. Pending order has Cancel Order button
    const pendingOrderBox = page.locator('div', { hasText: /Order #GL-ORD-PEND/i }).first();
    const cancelBtn = page.getByRole('button', { name: 'Cancel Order' });
    await expect(cancelBtn).toBeVisible();

    // 2. Delivered order has Request Exchange button
    const exchangeBtn = page.getByRole('button', { name: 'Request Exchange' });
    await expect(exchangeBtn).toBeVisible();

    // 3. Cancelled prepaid order displays Refund Processed badge and message
    await expect(page.getByText(/Refund Processed/i)).toBeVisible();
    await expect(page.getByText(/₹500.00 has been processed to your original payment method/i)).toBeVisible();
  });

  test('admin panel order management provides option to process refund for cancelled prepaid orders', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Admin panel tested on desktop');
    await setupMocks(page, { authenticated: true, isAdmin: true });
    await page.goto('/admin');

    // Click Orders sidebar nav
    const ordersNav = page.locator('button.admin-nav-item', { hasText: 'Orders' });
    await expect(ordersNav).toBeVisible({ timeout: 15_000 });
    await ordersNav.click();

    await expect(page.getByRole('heading', { name: 'Orders Management' })).toBeVisible();

    // Should display Refund Pending badge and Process Refund button
    await expect(page.getByText('Refund Pending')).toBeVisible();
    const refundBtn = page.getByRole('button', { name: 'Process Refund' });
    await expect(refundBtn).toBeVisible();
  });

  test('saving storefront maintenance mode displays specific confirmation toast', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Admin panel tested on desktop');
    await setupMocks(page, { authenticated: true, isAdmin: true });
    await page.goto('/admin');

    // Navigate to Settings
    const settingsNav = page.locator('button.admin-nav-item', { hasText: 'Settings' });
    await expect(settingsNav).toBeVisible({ timeout: 15_000 });
    await settingsNav.click();

    // Toggle Maintenance Mode
    const maintenanceToggle = page.locator('label.admin-switch-label input[type="checkbox"]').first();
    await maintenanceToggle.click();

    // Click Save All Settings
    const saveBtn = page.getByRole('button', { name: /Save All Settings/i });
    await saveBtn.click();

    // Must display specific maintenance mode confirmation toast, not standard shipping fee
    await expect(
      page.getByText('Settings saved successfully. Storefront Maintenance Mode is now enabled.')
    ).toBeVisible({ timeout: 10_000 });
  });

  test('create discount coupon modal validates uppercase code, mandatory fields, percentage limits and future dates', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Admin panel tested on desktop');
    await setupMocks(page, { authenticated: true, isAdmin: true });
    await page.goto('/admin');

    // Navigate to Marketing & Coupons
    const promoNav = page.locator('button.admin-nav-item', { hasText: /Coupons/i });
    await expect(promoNav).toBeVisible({ timeout: 15_000 });
    await promoNav.click();

    // Click Add Coupon / Create Discount Coupon
    const addCouponBtn = page.getByRole('button', { name: /Add Coupon|Create Coupon|New Coupon/i }).first();
    await addCouponBtn.click();

    await expect(page.getByRole('heading', { name: 'Create Discount Coupon' })).toBeVisible();

    const codeInput = page.locator('#coupon-code-input');
    const valueInput = page.locator('#coupon-value-input');
    const expiryInput = page.locator('#coupon-expiry-input');
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'Create Coupon' });

    // 1. Mandatory indicator asterisks
    await expect(page.getByText('Coupon Code *')).toBeVisible();
    await expect(page.getByText('Discount Type *')).toBeVisible();
    await expect(page.getByText('Discount Value *')).toBeVisible();
    await expect(page.getByText('Valid Until *')).toBeVisible();

    // 2. Code format validation: invalid lowercase / special characters
    await codeInput.fill('special-code!');
    // Value automatically gets uppercased to SPECIAL-CODE!
    await codeInput.blur();
    await expect(page.locator('.admin-field-error', { hasText: /uppercase letters and numbers only/i })).toBeVisible();

    // 3. Discount percentage > 100 validation
    await valueInput.fill('150');
    await valueInput.blur();
    await expect(page.getByText(/percentage discount must not exceed 100%/i)).toBeVisible();

    // 4. Past date validation
    await expiryInput.fill('2020-01-01');
    await expiryInput.blur();
    await expect(page.getByText(/past dates are not allowed/i)).toBeVisible();
  });

  test('accessing invalid URL (/robots.zml) returns HTTP 404 status code and renders custom 404 page', async ({ page }) => {
    await setupMocks(page);
    const response = await page.goto('/robots.zml');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /Oops! This page has gone off the trail/i })).toBeVisible({ timeout: 15_000 });
  });

  test('GA4 analytics script is present and dataLayer records virtual_page_view', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');

    const gaScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(gaScript).toHaveCount(1);

    const hasDataLayer = await page.evaluate(() => Array.isArray(window.dataLayer) && window.dataLayer.length > 0);
    expect(hasDataLayer).toBe(true);
  });
});
