// @ts-check
import { test, expect } from '@playwright/test';
test.use({ video: 'off' });
test.setTimeout(120000);

const now = new Date().toISOString();
const farmer = { id: 'farmer', name: 'Farmer With A Long Name', email: 'farmer.with.long.email.address@example.com', phone: '9876543210', location: 'Chennai', crops: 'Paddy', status: 'Active', totalOrders: 0, totalSpent: '₹0', registeredAt: now };
const booking = { id: 'booking-1', bookingReference: 'FB-SB-123456', serviceSlug: 'crop-doctor', serviceName: 'Crop Doctor', name: farmer.name, phone: farmer.phone, email: farmer.email, location: 'Chennai', createdAt: now, updatedAt: now, status: 'NEW', message: JSON.stringify({ cropName: 'Paddy', cropVariety: 'IR64', symptoms: 'Yellow leaves' }), details: { growthStage: 'Vegetative', sowingDate: '2026-10-01', irrigationMethod: 'Drip', symptomsDescription: 'Yellow leaves', affectedPart: 'Leaves', noticedWhen: 'One week', affectedPercent: '20', budget: '500000', startDate: '2026-12-01', additionalNotes: 'Please inspect the south field', responseMethod: 'WhatsApp', preferredLanguage: 'Tamil', bestTimeToContact: 'Morning', urgency: 'High' }, attachments: [{ filename: 'crop.png', name: 'Crop photo.png', mimeType: 'image/png', size: 68 }] };

async function setup(page, admin = true) {
  const state = { maintenanceMode: false, maintenanceMessage: 'Farm improvements in progress', standardShippingFee: 80, freeShippingThreshold: 5000 };
  const orders = [1, 2].map(id => ({ id: `order-${id}-12345`, user: farmer, shippingAddress: { phone: farmer.phone, fullName: farmer.name }, items: [{ title: 'Seeds', price: 100, quantity: 1 }], totalPrice: 100, orderStatus: 'PROCESSING', paymentStatus: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY', createdAt: now }));
  if (admin) await page.addInitScript(() => localStorage.setItem('formerbench_auth_token', 'regression-token'));
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url());
    const p = url.pathname.replace(/^\/api/, '');
    let data = [];
    if (p === '/auth/me') data = { id: 'admin', email: 'admin@example.com', name: 'Admin', role: 'ADMIN' };
    else if (p === '/store-settings') data = state;
    else if (p === '/admin/store-settings') { Object.assign(state, route.request().postDataJSON()); data = state; }
    else if (/^\/orders\/.*\/status$/.test(p)) { const order = orders.find(order => p.includes(order.id)); Object.assign(order, route.request().postDataJSON()); data = order; }
    else if (p === '/orders') data = { orders, total: orders.length, totalPages: 1 };
    else if (p === '/admin/customers') data = { customers: [farmer], total: 1, totalPages: 1 };
    else if (p === '/admin/analytics') data = { totalRevenue: 0, totalOrders: 2, totalProducts: 2, totalCustomers: 1, recentOrders: [], lowStockProducts: [], monthlySales: [] };
    else if (p === '/service-bookings/stats') data = { totalBookings: 1, newBookings: 1, serviceBreakdown: [] };
    else if (p.endsWith('/attachments/crop.png')) return route.fulfill({ contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') });
    else if (p === '/service-bookings/booking-1') data = booking;
    else if (p === '/service-bookings') data = { bookings: url.searchParams.get('serviceSlug') === 'crop-calendar' ? [] : [url.searchParams.get('serviceSlug') === 'crop-doctor' ? booking : { ...booking, serviceSlug: 'farm-development', serviceName: 'Farm Development' }], total: 1, totalPages: 1 };
    else if (p === '/products') return route.fulfill({ json: { success: true, data: [1, 2].map(id => ({ id: `product-${id}`, title: `Seeds ${id}`, slug: `seed-${id}`, description: 'Seeds for farms', price: 100, stock: 10, images: [], rating: 4, featured: true, categoryId: 'cat', category: { name: 'Seeds' } })), pagination: { total: 2, totalPages: 1 } } });
    else if (p === '/cart') data = { items: [] };
    else if (p === '/contacts') data = { contacts: [], total: 0 };
    else if (p === '/blogs') data = [];
    return route.fulfill({ json: { success: true, data } });
  });
  return state;
}

async function nav(page, name) {
  await page.locator('.admin-sidebar').waitFor({ state: 'attached' });
  const menu = page.getByRole('button', { name: 'Open admin navigation' });
  if (await menu.isVisible()) await menu.click();
  await page.locator('.admin-sidebar').locator('button').filter({ has: page.locator('span').getByText(name, { exact: true }) }).click();
}

test('cancelled orders stay in All and update Cancelled count', async ({ page }) => {
  await setup(page); await page.goto('/admin'); await nav(page, 'Orders');
  await expect(page.getByRole('columnheader', { name: 'Order Status', exact: true })).toBeVisible();
  await page.locator('tbody tr').first().locator('select').selectOption('Cancelled');
  await expect(page.getByRole('button', { name: 'Cancelled (1)', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All (2)', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(2);
  await page.getByRole('button', { name: 'Cancelled (1)', exact: true }).click();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody select')).toHaveValue('Cancelled');
});

test('expert form rejects numeric names and long mobile numbers', async ({ page }) => {
  await setup(page); await page.goto('/admin'); await nav(page, 'Experts');
  await page.getByRole('button', { name: /register expert/i }).click();
  await page.locator('[name=expName]').fill('5988899');
  expect(await page.locator('[name=expName]').evaluate(el => el.checkValidity())).toBe(false);
  await page.locator('[name=expName]').fill('Dr. R. Senthil M.Sc. (Agri)');
  expect(await page.locator('[name=expName]').evaluate(el => el.checkValidity())).toBe(true);
  await page.locator('[name=expPhone]').evaluate(el => { el.value = '98765432101'; });
  expect(await page.locator('[name=expPhone]').evaluate(el => el.checkValidity())).toBe(false);
});

test('service and Crop Doctor details include complete fields and photo previews', async ({ page }) => {
  await setup(page); await page.goto('/admin'); await nav(page, 'Service Bookings');
  await page.getByRole('button', { name: 'View Details', exact: true }).click();
  await expect(page.getByText('Vegetative', { exact: true })).toBeVisible();
  await expect(page.getByText('Please inspect the south field', { exact: true })).toBeVisible();
  await expect(page.getByText('WhatsApp', { exact: true })).toBeVisible();
  await expect(page.getByAltText('Crop photo.png')).toBeVisible();
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close Preview', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close modal' }).click();
  await page.getByRole('button', { name: 'Update Status', exact: true }).click();
  await expect(page.getByText('Choose a booking, update its status, and add notes for your team.')).toBeVisible();
  await expect(page.getByText(/Persists directly|Database Admin Notes/)).toHaveCount(0);
  const select = page.locator('.admin-booking-select');
  expect(await select.locator('option').first().textContent()).not.toContain('Chennai');
  await page.locator('.admin-modal-close-btn').last().click();
  await nav(page, 'Crop Doctor');
  await page.getByRole('button', { name: 'View Details', exact: true }).click();
  await expect(page.getByText('Vegetative', { exact: true })).toBeVisible();
});

test('customer table separates name, email and required phone', async ({ page }) => {
  await setup(page); await page.goto('/admin'); await nav(page, 'Customers');
  await expect(page.getByRole('columnheader', { name: 'Phone Number', exact: true })).toBeVisible();
  const row = page.locator('.admin-customers-table tbody tr').first();
  await expect(row.locator('td').nth(0)).toContainText(farmer.name);
  await expect(row.locator('td').nth(1)).toContainText(farmer.email);
  await expect(row.locator('td').nth(2)).toContainText(farmer.phone);
  const emailBounds = await row.locator('td').nth(1).boundingBox();
  const phoneBounds = await row.locator('td').nth(2).boundingBox();
  expect(emailBounds.x + emailBounds.width).toBeLessThanOrEqual(phoneBounds.x + 1);
});

test('maintenance mode loads from server in a fresh session and can be disabled', async ({ page }) => {
  const state = await setup(page, false); state.maintenanceMode = true;
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: 'We’ll be back growing soon.' })).toBeVisible();
  await expect(page.getByText(state.maintenanceMessage, { exact: true })).toBeVisible();
  state.maintenanceMode = false; await page.reload();
  await expect(page.getByRole('heading', { name: 'We’ll be back growing soon.' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Growing Better, Together', exact: true })).toBeVisible();
});

test('two best sellers fill the row and Smart Hub content has room', async ({ page }) => {
  await setup(page, false); await page.goto('/');
  const grid = page.locator('.agriflow-best-sellers-grid');
  await expect(grid.locator('.agriflow-product-item')).toHaveCount(2, { timeout: 20000 });
  const widths = await grid.evaluate(el => ({ grid: el.clientWidth, columns: getComputedStyle(el).gridTemplateColumns.split(' ').map(Number.parseFloat) }));
  expect(widths.columns.length).toBe(2);
  for (const card of await page.locator('.smart-hub-card').all()) {
    const p = await card.locator('p').boundingBox();
    const button = await card.locator('a').boundingBox();
    expect(p.y + p.height).toBeLessThanOrEqual(button.y);
  }
});
