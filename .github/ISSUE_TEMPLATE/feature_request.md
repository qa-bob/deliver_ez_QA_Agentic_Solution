---
name: Feature request — new test coverage
about: Request coverage for a page, feature, or scenario not yet tested
title: '[TEST] <feature or page name>'
labels: enhancement
assignees: ''
---

## What needs to be tested?

<!-- Describe the page, feature, or user flow that lacks test coverage. -->

## URL or location on the site

**Page URL:** `http://www.deliver-ez.com/<path>`
**Section:** (e.g., hero section, pricing table, contact form)

## Proposed test category

- [ ] `@smoke` — availability / basic load
- [ ] `@navigation` — routing, nav links, menus
- [ ] `@forms` — form fields and validation (no submission)
- [ ] `@functional` — business logic, interactive elements
- [ ] `@visual` — screenshot regression
- [ ] `@responsive` — layout at mobile/tablet/desktop

## Acceptance criteria

<!-- What should the tests verify? Be specific — good criteria become test assertions. -->

- [ ]
- [ ]
- [ ]

## Page object changes needed

<!-- Does this require a new page object class, or additions to an existing one? -->

- [ ] New class: `src/pages/<name>.page.ts`
- [ ] Update existing: `src/pages/<name>.page.ts`
- [ ] No page object changes needed

## Why this matters

<!-- What risk does untested coverage introduce? What has broken in the past? -->

## Additional context

<!-- Screenshots of the UI, links to relevant code, or any other context. -->
