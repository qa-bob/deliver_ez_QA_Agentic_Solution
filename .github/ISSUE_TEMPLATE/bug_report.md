---
name: Bug report — broken test or selector
about: Report a test failure, broken selector, or incorrect assertion
title: '[BUG] <test name or file> — <short description>'
labels: bug
assignees: ''
---

## Failing test

**File:** `tests/<category>/<spec-file>.spec.ts`
**Test name:** (exact string from the test)
**Tag:** `@smoke` / `@navigation` / `@forms` / `@functional` / `@visual` / `@responsive`

## How to reproduce

```bash
npx playwright test <path-to-spec> --project=chromium-desktop
```

## Expected behavior

<!-- What should the test do / assert? -->

## Actual behavior

<!-- What error or failure did you see? Paste the Playwright error output. -->

```
<paste error here>
```

## Environment

- OS:
- Node.js version: (`node --version`)
- Playwright version: (`npx playwright --version`)
- Branch:

## Likely cause

- [ ] Selector changed on the live site
- [ ] Site content changed (text, URL, structure)
- [ ] Playwright version incompatibility
- [ ] Visual baseline is stale — needs `/update-baseline`
- [ ] Flaky timing issue
- [ ] Unknown

## Additional context

<!-- Screenshots, HTML report link, or any other relevant information. -->
