---
paths:
  - "tests/**/*.spec.ts"
---

# Test File Rules

These rules apply when working in `tests/`.

- Import test and expect from the custom fixture: `import { test, expect } from '@fixtures/site.fixture'`
- Tag every test with at least one annotation: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never call `page.locator()` directly in the test body — use page object methods and properties
- Never hardcode the base URL — use `baseURL` from Playwright config
- Never submit forms, never call `page.click()` on a submit button
- Never create accounts or enter real credentials
- No `page.waitForTimeout()` — use `page.waitForSelector()` or rely on Playwright auto-waiting
- Keep each test independent: no shared state between tests except what is set up in `beforeEach`
- One `test.describe()` block per page or feature area per file
- Test titles should read as plain English assertions: `'homepage hero section is visible on mobile'`
