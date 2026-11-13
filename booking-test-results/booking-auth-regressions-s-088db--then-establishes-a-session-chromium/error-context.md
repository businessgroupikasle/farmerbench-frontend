# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-auth-regressions.spec.js >> signup sends and verifies OTP, then establishes a session
- Location: tests\booking-auth-regressions.spec.js:35:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('form').filter({ has: getByPlaceholder('Farmer / Business Name') }).getByPlaceholder('Phone Number')

```

# Page snapshot

```yaml
- main [ref=e4]:
  - generic [ref=e5]:
    - link "Back to Home" [ref=e6] [cursor=pointer]:
      - /url: /
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e22]:
          - generic:
            - generic: SMART AGRICULTURE
            - heading "Growing a better tomorrow" [level=1]
            - paragraph: Smart solutions for modern farming. Manage, monitor, and maximize your crop yield with technology.
            - generic:
              - generic: Encrypted Email OTP Authentication
              - generic: 10,000+ Active Growers Across Tamil Nadu
              - generic: Fast & Single-Use Password Reset Protection
          - generic [ref=e23]:
            - generic [ref=e24]: JOIN AgriEra
            - heading "Empowering every farm, every crop" [level=1] [ref=e25]
            - paragraph [ref=e27]: Register today to access certified bio-fertilizers, field doctor diagnosis, and real-time advisory.
            - generic [ref=e28]:
              - generic [ref=e29]: 100% Verified Farm Profiles & Security
              - generic [ref=e34]: Direct Farm Gate Deliveries in 24-48 Hours
              - generic [ref=e41]: "Welcome Coupon: ₹120 Off First Order"
        - generic [ref=e45]:
          - button "Go to slide 1" [ref=e46] [cursor=pointer]
          - button "Go to slide 2" [ref=e47] [cursor=pointer]
          - button "Go to slide 3" [ref=e48] [cursor=pointer]
      - generic [ref=e50]:
        - generic [ref=e51]:
          - button "LOGIN" [ref=e52] [cursor=pointer]
          - button "SIGN UP" [ref=e53] [cursor=pointer]
        - generic [ref=e54]:
          - img "AgriEra Logo" [ref=e55]
          - heading "AgriEra" [level=2] [ref=e56]
          - paragraph [ref=e57]: Grow Better, Live Better
        - generic [ref=e60]:
          - generic [ref=e61]:
            - heading "Welcome Back!" [level=3] [ref=e62]
            - paragraph [ref=e63]: Login to continue your agricultural journey
            - generic [ref=e64]:
              - textbox "Email or Phone Number" [ref=e66]: arun@example.com
              - generic [ref=e67]:
                - textbox "Password" [ref=e68]
                - button "Show password" [ref=e69] [cursor=pointer]
              - generic [ref=e73]:
                - generic [ref=e74] [cursor=pointer]:
                  - checkbox "Remember me" [checked] [ref=e75]
                  - generic [ref=e76]: Remember me
                - button "Forgot Password?" [ref=e77] [cursor=pointer]
              - button "Login" [ref=e78] [cursor=pointer]
          - generic [ref=e84]:
            - heading "Create Account" [level=3] [ref=e85]
            - paragraph [ref=e86]: Join thousands of verified farmers & growers
            - generic [ref=e87]:
              - textbox "Farmer / Business Name" [ref=e89]: Arun Kumar
              - generic [ref=e90]:
                - textbox "Email Address" [disabled] [ref=e91]: arun@example.com
                - generic "Email is verified" [ref=e93]: Verified
              - textbox "Enter a valid 10-digit mobile number" [ref=e97]:
                - /placeholder: 10-digit Mobile Number
              - textbox "Location (e.g. Coimbatore, Tamil Nadu)" [ref=e99]
              - generic [ref=e100]:
                - textbox "Create Password (min. 8 chars)" [ref=e101]
                - button "Show password" [ref=e102] [cursor=pointer]
              - generic [ref=e106]:
                - textbox "Confirm Password" [ref=e107]
                - button "Show confirm password" [ref=e108] [cursor=pointer]
              - generic [ref=e113] [cursor=pointer]:
                - checkbox "I accept Terms of Service & Privacy Policy" [checked] [ref=e114]
                - generic [ref=e115]: I accept Terms of Service & Privacy Policy
              - button "Create Account & Start Farming" [ref=e116] [cursor=pointer]
        - generic [ref=e122]: or
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.beforeEach(async ({ page }) => {
  4   |   await page.route('**/api/**', route => route.fulfill({ json: { success: true, data: [] } }));
  5   | });
  6   | 
  7   | for (const slug of ['farm-development', 'well-development', 'drip-irrigation', 'farm-consultancy']) {
  8   |   test(`${slug} rejects numeric farmer names and accepts letters`, async ({ page }) => {
  9   |     await page.goto(`/services/${slug}`);
  10  |     const name = page.getByRole('textbox', { name: 'Farmer Name', exact: true });
  11  |     await name.fill('45888988');
  12  |     await expect(page.getByRole('alert')).toHaveText('Please enter a valid farmer name.');
  13  |     expect(await name.evaluate(el => el.checkValidity())).toBe(false);
  14  |     await name.fill('அருண் Kumar');
  15  |     expect(await name.evaluate(el => el.checkValidity())).toBe(true);
  16  |     await expect(page.getByRole('alert')).toHaveCount(0);
  17  |   });
  18  | }
  19  | 
  20  | for (const slug of ['farm-development', 'well-development', 'farm-consultancy']) {
  21  |   test(`${slug} restricts past scheduling dates`, async ({ page }) => {
  22  |     await page.clock.install({ time: new Date('2026-11-11T12:00:00') });
  23  |     await page.goto(`/services/${slug}`);
  24  |     const isTime = slug === 'farm-consultancy';
  25  |     const date = page.locator(isTime ? 'input[type="datetime-local"]' : 'input[type="date"]');
  26  |     await date.fill(isTime ? '2026-11-11T11:59' : '2026-09-27');
  27  |     await expect(page.getByRole('alert')).toContainText(isTime ? 'future date and time' : 'today or a future date');
  28  |     expect(await date.evaluate(el => el.checkValidity())).toBe(false);
  29  |     await date.fill(isTime ? '2026-11-11T12:01' : '2026-11-11');
  30  |     expect(await date.evaluate(el => el.checkValidity())).toBe(true);
  31  |     await expect(page.getByRole('alert')).toHaveCount(0);
  32  |   });
  33  | }
  34  | 
  35  | test('signup sends and verifies OTP, then establishes a session', async ({ page }) => {
  36  |   const user = { id: 'test-user', name: 'Arun Kumar', role: 'CUSTOMER', email: 'arun@example.com' };
  37  |   await page.route('**/api/auth/**', async route => {
  38  |     const path = new URL(route.request().url()).pathname;
  39  |     const data = path.endsWith('verify-register-otp') ? { registrationToken: 'verified-email-token' }
  40  |       : path.endsWith('complete-registration') ? { user, token: 'session-token' }
  41  |       : path.endsWith('/me') ? user : {};
  42  |     await route.fulfill({ json: { success: true, data } });
  43  |   });
  44  |   await page.goto('/signup');
  45  |   const form = page.locator('form').filter({ has: page.getByPlaceholder('Farmer / Business Name') });
  46  |   await form.getByPlaceholder('Farmer / Business Name').fill('Arun Kumar');
  47  |   await form.getByPlaceholder('Email Address', { exact: true }).fill('arun@example.com');
  48  |   await form.getByRole('button', { name: 'Send OTP' }).click();
  49  |   for (let i=0;i<6;i++) await page.locator(`#signup-inline-otp-${i}`).fill(String(i+1));
  50  |   await form.getByRole('button', { name: 'Verify OTP', exact: true }).click();
  51  |   await expect(form.getByText('Verified', { exact: true })).toBeVisible();
> 52  |   await form.getByPlaceholder('Phone Number', { exact: false }).fill('9876543210');
      |                                                                 ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  53  |   await form.getByPlaceholder('Location (e.g. Coimbatore, Tamil Nadu)').fill('Coimbatore');
  54  |   await form.getByPlaceholder('Create Password (min. 8 chars)').fill('Harvest!2026');
  55  |   await form.getByPlaceholder('Confirm Password', { exact: true }).fill('Harvest!2026');
  56  |   await form.getByRole('button', { name: 'Create Account & Start Farming' }).click();
  57  |   await expect(page).toHaveURL(/\/products$/);
  58  |   expect(await page.evaluate(() => localStorage.getItem('formerbench_auth_token'))).toBe('session-token');
  59  | });
  60  | 
  61  | test('forgot password verifies OTP and submits the authorized new password', async ({ page }) => {
  62  |   let resetBody;
  63  |   await page.route('**/api/auth/**', async route => {
  64  |     const path = new URL(route.request().url()).pathname;
  65  |     if (path.endsWith('/reset-password')) resetBody = route.request().postDataJSON();
  66  |     await route.fulfill({ json: { success: true, data: path.endsWith('verify-reset-otp') ? { resetToken: 'reset-token' } : {}, message: 'Request successful' } });
  67  |   });
  68  |   await page.goto('/login');
  69  |   await page.getByRole('button', { name: 'Forgot Password?' }).click();
  70  |   await page.locator('input[type="email"]').fill('arun@example.com');
  71  |   await page.locator('form button[type="submit"]').click();
  72  |   for (let i=0;i<6;i++) await page.locator(`#forgot-otp-digit-${i}`).fill(String(i+1));
  73  |   await page.locator('form button[type="submit"]').click();
  74  |   await page.locator('input[type="password"]').nth(0).fill('Harvest!2026');
  75  |   await page.locator('input[type="password"]').nth(1).fill('Harvest!2026');
  76  |   await page.locator('form button[type="submit"]').click();
  77  |   await expect(page.getByRole('button', { name: 'Log In With New Password' })).toBeVisible();
  78  |   expect(resetBody).toMatchObject({ resetToken: 'reset-token', newPassword: 'Harvest!2026' });
  79  | });
  80  | 
  81  | test('footer WhatsApp opens the business conversation in a new tab', async ({ page }) => {
  82  |   await page.goto('/');
  83  |   const link = page.locator('footer').getByRole('link', { name: 'WhatsApp', exact: true });
  84  |   await expect(link).toHaveAttribute('href', 'https://wa.me/919360763060');
  85  |   await expect(link).toHaveAttribute('target', '_blank');
  86  | });
  87  | 
  88  | test('password login establishes a session and survives reload', async ({ page }) => {
  89  |   const user = { id: 'login-user', name: 'Arun Kumar', role: 'CUSTOMER', email: 'arun@example.com' };
  90  |   await page.route('**/api/auth/**', route => route.fulfill({ json: {
  91  |     success: true, data: route.request().url().endsWith('/me') ? user : { user, token: 'login-session' },
  92  |   } }));
  93  |   await page.goto('/login');
  94  |   const form = page.locator('form').filter({ has: page.getByPlaceholder('Email or Phone Number') });
  95  |   await form.getByPlaceholder('Email or Phone Number').fill('arun@example.com');
  96  |   await form.getByPlaceholder('Password', { exact: true }).fill('Harvest!2026');
  97  |   await form.getByRole('button', { name: 'Login', exact: true }).click();
  98  |   await expect(page).toHaveURL(/\/dashboard$/);
  99  |   await page.reload();
  100 |   await expect(page).toHaveURL(/\/dashboard$/);
  101 |   expect(await page.evaluate(() => localStorage.getItem('formerbench_auth_token'))).toBe('login-session');
  102 | });
  103 | 
  104 | test('failed OTP dispatch does not advance to verification', async ({ page }) => {
  105 |   await page.route('**/api/auth/register-otp', route => route.fulfill({
  106 |     json: { success: false, message: 'Unable to send code. Please try again.' },
  107 |   }));
  108 |   await page.goto('/signup');
  109 |   await page.getByPlaceholder('Farmer / Business Name').fill('Arun Kumar');
  110 |   await page.getByPlaceholder('Email Address', { exact: true }).fill('arun@example.com');
  111 |   await page.getByRole('button', { name: 'Send OTP', exact: true }).click();
  112 |   await expect(page.getByText('Unable to send code. Please try again.', { exact: true })).toBeVisible();
  113 |   await expect(page.locator('#signup-inline-otp-0')).toHaveCount(0);
  114 | });
  115 | 
```