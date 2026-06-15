---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Model Rules

These rules apply when working in `src/pages/`.

- Every class must extend `BasePage` from `./base.page`
- Declare all element locators as `readonly Locator` properties at the top of the class, before the constructor
- Methods represent user actions only — click, fill, hover, scroll — never assertions
- Never call `expect()` inside a page object method
- Never navigate directly inside page object constructors — use a `navigate()` method
- Use accessible locators when available: `page.getByRole()`, `page.getByLabel()`, `page.getByText()` — fall back to `page.locator('css')` only when necessary
- All methods must be `async` and return `Promise<void>` or a typed Promise
- Strict TypeScript: no implicit `any`, no `as any` without a justifying comment
