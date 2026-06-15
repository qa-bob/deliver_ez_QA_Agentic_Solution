# GitHub Copilot Instructions

This repository is a **Playwright + TypeScript regression test suite** for `http://www.deliver-ez.com/`. It follows the **Page Object Model (POM)** design pattern with strict TypeScript.

These instructions apply to all code Copilot generates or suggests in this repository.

---

## Architecture Rules

### Page Object Model

- Every page or major UI section has its own class in `src/pages/`
- All page classes **must extend `BasePage`** from `src/pages/base.page.ts`
- Locators are **`readonly Locator` properties** declared on the class — never inline in methods
- Methods represent user actions (click, fill, hover) — **never assertions**
- **No `expect()` calls** inside page object classes — assertions belong in spec files only

### Tests

- Import page objects using the custom fixture: `import { test, expect } from '@fixtures/site.fixture'`
- **Tag every test** with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- **Never hardcode URLs** — use `baseURL` from Playwright config
- **Never submit forms** — test field interactions and validation only
- **Never create accounts** or enter real credentials

### TypeScript

- Strict mode is enabled — **no implicit `any`**
- All page object properties must be explicitly typed
- Never use `page.waitForTimeout()` — use Playwright's auto-waiting or `waitForSelector`

---

## File Organization

| What | Where |
|------|-------|
| Page objects | `src/pages/<name>.page.ts` |
| Test fixtures | `src/fixtures/site.fixture.ts` |
| Utility helpers | `src/utils/` |
| TypeScript types | `src/types/` |
| Smoke tests | `tests/smoke/` |
| Navigation tests | `tests/navigation/` |
| Form tests | `tests/forms/` |
| Functional tests | `tests/functional/` |
| Visual tests | `tests/visual/` |
| Responsive tests | `tests/responsive/` |

---

## Code Style

- Use `async/await` throughout — no `.then()` chains
- Prefer `await expect(locator).toBeVisible()` over `await locator.isVisible()`
- Use descriptive test titles: `'homepage hero section is visible on mobile'`
- One `test.describe()` block per page or feature area
- Keep spec files focused — one concern per file

---

## Do Not Generate

- Code that submits forms (`page.click('button[type=submit]')`)
- Hardcoded base URLs (`page.goto('http://www.deliver-ez.com/...')`)
- `page.waitForTimeout()` calls
- `expect()` calls inside page object methods
- Tests without `@tag` annotations
- TypeScript `any` without a justifying comment
