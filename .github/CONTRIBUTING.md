# Contributing to the Deliver EZ QA Suite

Thank you for contributing. This guide covers the rules all contributors must follow to keep the test suite reliable, maintainable, and AI-friendly.

---

## Before You Start

1. Read the [README](../README.md) to understand the project purpose and tech stack.
2. Read `CLAUDE.md` in the repo root — these are the rules Claude Code follows, and human contributors must follow them too.
3. Make sure your development environment is set up (see [README — Dev Setup](../README.md#development-environment-setup)).

---

## Core Rules

### Architecture

- **Page Object Model (POM) is mandatory.** Every selector and user action lives in a page object class in `src/pages/`. Spec files only call page object methods and run assertions.
- **All page objects extend `BasePage`** from `src/pages/base.page.ts`. Shared utilities (navigate, screenshot, console errors) live there — do not duplicate them in subclasses.
- **Locators are `readonly Locator` class properties**, declared at the top of each page class. Never declare a `page.locator()` call inline inside a test body.
- **One page object per page or section.** Don't combine the homepage and the contact page in the same class.

### Tests

- **Never submit forms.** Test field interactions and validation only. No clicking "Submit" or "Send".
- **Never create accounts or log in** unless `auth.required: true` in `site.config.json`.
- **Never hardcode the base URL.** Use `baseURL` from Playwright config, which reads `site.config.json` at runtime.
- **Tag every test** with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
- **No `expect()` inside page object methods.** Assertions belong in spec files only.
- **No `page.waitForTimeout()`.** Use Playwright's built-in auto-waiting, `waitForSelector`, or `waitForLoadState`.
- **No `any` type** without an inline comment explaining why it is unavoidable.

### TypeScript

- Strict mode is on (`tsconfig.json`). Run `npm run typecheck` and confirm it exits 0 before opening a PR.
- All page object properties must be explicitly typed — no inferred `any`.

---

## Workflow

### Creating a New Test

1. Read `site.config.json` to understand the site's features and flags.
2. Fetch the live site to find real selectors — do not guess class names or IDs.
3. Add or update the relevant page object in `src/pages/`.
4. Write the spec file in the correct `tests/<category>/` folder.
5. Run `npm run typecheck` — must exit 0.
6. Run the test locally: `npx playwright test <path-to-spec>` — must pass.
7. Open a PR using the PR template.

### Fixing a Broken Test

1. Run `npm test` to confirm the failure is reproducible.
2. Inspect whether the selector changed on the live site (use DevTools or `/analyze-site`).
3. Update the page object locator, not the test assertion (unless the assertion itself was wrong).
4. Run `npm test` again — must pass.
5. Open a PR.

### Updating Visual Baselines

After an intentional design change, run:

```bash
npm run baseline
```

Review every updated screenshot in `__snapshots__/` before committing. Never commit baselines you have not personally reviewed. Use the `/update-baseline` skill in Claude Code for a guided workflow.

---

## Commit Messages

Follow this convention:

```
<type>(<scope>): <short description>

type:   feat | fix | test | refactor | chore | docs
scope:  smoke | navigation | forms | functional | visual | responsive | pom | config
```

Examples:

```
test(smoke): add console error check for homepage load
fix(navigation): update nav locator after site redesign
chore(config): bump Playwright to 1.45.0
docs(readme): add visual regression section
```

---

## Pull Request Checklist

The PR template enforces this checklist. Every PR must:

- [ ] Follow POM — locators and actions in `src/pages/`, not in spec bodies
- [ ] Tag all new/modified tests with appropriate `@tags`
- [ ] Pass `npm run typecheck` (exit 0)
- [ ] Pass `npm test` locally (exit 0)
- [ ] Not submit forms, create accounts, or hardcode URLs
- [ ] Include a description of what the change covers and why

---

## AI-Assisted Contributions

This repo is Claude Code-enabled. If you use Claude Code to generate or modify tests:

- Run the generated code through `npm run typecheck` before opening a PR
- Verify all selectors against the live site — AI-generated selectors can drift
- Do not commit code you have not read and understood
- Agent-generated files follow the same rules as human-written files

---

## Questions

Open a GitHub Issue using the `feature_request.md` template to propose new test coverage, or `bug_report.md` to report a broken test.
