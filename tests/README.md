# Playwright website tests

Run the complete desktop and mobile suite:

```bash
npm run test:e2e
```

Useful commands:

```bash
npm run test:e2e:headed
npm run test:e2e:ui
npm run test:e2e:report
```

The configuration starts Vite automatically on port `4173`. Set
`PLAYWRIGHT_BASE_URL` to test an already deployed website instead.

Product and cart cases use the configured backend. When it has no product
data, only those data-dependent cases are skipped; route and layout coverage
continues to run.
