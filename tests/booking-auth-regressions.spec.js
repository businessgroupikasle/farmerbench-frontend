import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // These flows do not depend on third-party analytics, fonts, or Google sign-in.
  await page.route(/^https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com|accounts\.google\.com|www\.googletagmanager\.com)\//, route => route.abort());
  await page.route('**/api/**', route => route.fulfill({ json: { success: true, data: [] } }));
});

for (const slug of ['farm-development', 'well-development', 'drip-irrigation', 'farm-consultancy']) {
  test(`${slug} rejects numeric farmer names and accepts letters`, async ({ page }) => {
    await page.goto(`/services/${slug}`);
    const name = page.getByRole('textbox', { name: 'Farmer Name', exact: true });
    await name.fill('45888988');
    await expect(page.getByRole('alert')).toHaveText('Please enter a valid farmer name.');
    expect(await name.evaluate(el => el.checkValidity())).toBe(false);
    await name.fill('அருண் Kumar');
    expect(await name.evaluate(el => el.checkValidity())).toBe(true);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}

for (const slug of ['farm-development', 'well-development', 'farm-consultancy']) {
  test(`${slug} restricts past scheduling dates`, async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-11T12:00:00') });
    await page.goto(`/services/${slug}`);
    const isTime = slug === 'farm-consultancy';
    const date = page.locator(isTime ? 'input[type="datetime-local"]' : 'input[type="date"]');
    await date.fill(isTime ? '2026-11-11T11:59' : '2026-09-27');
    await expect(page.getByRole('alert')).toContainText(isTime ? 'future date and time' : 'today or a future date');
    expect(await date.evaluate(el => el.checkValidity())).toBe(false);
    await date.fill(isTime ? '2026-11-11T12:01' : '2026-11-11');
    expect(await date.evaluate(el => el.checkValidity())).toBe(true);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}

test('signup sends and verifies OTP, then establishes a session', async ({ page }) => {
  const user = { id: 'test-user', name: 'Arun Kumar', role: 'CUSTOMER', email: 'arun@example.com' };
  await page.route('**/api/auth/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const data = path.endsWith('verify-register-otp') ? { registrationToken: 'verified-email-token' }
      : path.endsWith('complete-registration') ? { user, token: 'session-token' }
      : path.endsWith('/me') ? user : {};
    await route.fulfill({ json: { success: true, data } });
  });
  await page.goto('/signup');
  const form = page.locator('form').filter({ has: page.getByPlaceholder('Farmer / Business Name') });
  await form.getByPlaceholder('Farmer / Business Name').fill('Arun Kumar');
  await form.getByPlaceholder('Email Address', { exact: true }).fill('arun@example.com');
  await form.getByRole('button', { name: 'Send OTP' }).click();
  for (let i=0;i<6;i++) await page.locator(`#signup-inline-otp-${i}`).fill(String(i+1));
  await form.getByRole('button', { name: 'Verify OTP', exact: true }).click();
  await expect(form.getByText('Verified', { exact: true })).toBeVisible();
  await form.locator('input[type="tel"]').fill('9876543210');
  await form.getByPlaceholder('Location (e.g. Coimbatore, Tamil Nadu)').fill('Coimbatore');
  await form.getByPlaceholder('Create Password (min. 8 chars)').fill('Harvest!2026');
  await form.getByPlaceholder('Confirm Password', { exact: true }).fill('Harvest!2026');
  await form.getByRole('button', { name: 'Create Account & Start Farming' }).click();
  await expect(page).toHaveURL(/\/products$/);
  expect(await page.evaluate(() => localStorage.getItem('formerbench_auth_token'))).toBe('session-token');
});

test('forgot password verifies OTP and submits the authorized new password', async ({ page }) => {
  let resetBody;
  await page.route('**/api/auth/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/reset-password')) resetBody = route.request().postDataJSON();
    await route.fulfill({ json: { success: true, data: path.endsWith('verify-reset-otp') ? { resetToken: 'reset-token' } : {}, message: 'Request successful' } });
  });
  await page.goto('/login');
  await page.getByRole('button', { name: 'Forgot Password?' }).click();
  await page.locator('input[type="email"]').fill('arun@example.com');
  await page.locator('form button[type="submit"]').click();
  for (let i=0;i<6;i++) await page.locator(`#forgot-otp-digit-${i}`).fill(String(i+1));
  await page.locator('form button[type="submit"]').click();
  await page.locator('input[type="password"]').nth(0).fill('Harvest!2026');
  await page.locator('input[type="password"]').nth(1).fill('Harvest!2026');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByRole('button', { name: 'Log In With New Password' })).toBeVisible();
  expect(resetBody).toMatchObject({ resetToken: 'reset-token', newPassword: 'Harvest!2026' });
});

test('footer WhatsApp opens the business conversation in a new tab', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('footer').getByRole('link', { name: 'WhatsApp', exact: true });
  await expect(link).toHaveAttribute('href', 'https://wa.me/919360763060');
  await expect(link).toHaveAttribute('target', '_blank');
});

test('password login establishes a session and survives reload', async ({ page }) => {
  const user = { id: 'login-user', name: 'Arun Kumar', role: 'CUSTOMER', email: 'arun@example.com' };
  await page.route('**/api/auth/**', route => route.fulfill({ json: {
    success: true, data: route.request().url().endsWith('/me') ? user : { user, token: 'login-session' },
  } }));
  await page.goto('/login');
  const form = page.locator('form').filter({ has: page.getByPlaceholder('Email or Phone Number') });
  await form.getByPlaceholder('Email or Phone Number').fill('arun@example.com');
  await form.getByPlaceholder('Password', { exact: true }).fill('Harvest!2026');
  await form.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.reload();
  await expect(page).toHaveURL(/\/dashboard$/);
  expect(await page.evaluate(() => localStorage.getItem('formerbench_auth_token'))).toBe('login-session');
});

test('failed OTP dispatch does not advance to verification', async ({ page }) => {
  await page.route('**/api/auth/register-otp', route => route.fulfill({
    json: { success: false, message: 'Unable to send code. Please try again.' },
  }));
  await page.goto('/signup');
  await page.getByPlaceholder('Farmer / Business Name').fill('Arun Kumar');
  await page.getByPlaceholder('Email Address', { exact: true }).fill('arun@example.com');
  await page.getByRole('button', { name: 'Send OTP', exact: true }).click();
  await expect(page.getByText('Unable to send code. Please try again.', { exact: true })).toBeVisible();
  await expect(page.locator('#signup-inline-otp-0')).toHaveCount(0);
});
