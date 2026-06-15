## Summary

<!-- Describe what this PR changes and why. One to three sentences. -->

## Type of change

- [ ] New test(s)
- [ ] Fix broken test / update selector
- [ ] Update visual baseline
- [ ] Refactor page object
- [ ] Config / dependency update
- [ ] Documentation

## Test coverage

<!-- List the test files added or modified, and what they cover. -->

| File | Category | What it tests |
|------|----------|---------------|
| | | |

## Checklist

- [ ] All new/modified tests are tagged (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`)
- [ ] Locators and actions live in `src/pages/` — no raw `page.locator()` calls in spec bodies
- [ ] No `expect()` calls inside page object methods
- [ ] No hardcoded base URL — uses `baseURL` from Playwright config
- [ ] No form submission, no account creation
- [ ] No `page.waitForTimeout()` calls
- [ ] `npm run typecheck` exits 0
- [ ] `npm test` passes locally (or failing tests are documented below)
- [ ] Visual baselines reviewed before committing (if `@visual` tests changed)

## Screenshots / evidence

<!-- Attach a Playwright HTML report snippet, screenshot, or test output confirming the change works. -->

## Known issues or follow-ups

<!-- Note anything intentionally left out or that needs a follow-up PR. -->
