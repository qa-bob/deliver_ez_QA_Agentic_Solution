# Skills (Slash Commands)

Skills are repeatable workflows invoked with `/command-name` from any Claude Code session. They are defined as markdown files in `.claude/commands/` and loaded automatically.

For agent documentation, see [AGENTS.md](./AGENTS.md). For project-level Claude Code instructions, see [CLAUDE.md](./CLAUDE.md).

---

## Available Skills

| Command | File | Description |
|---------|------|-------------|
| `/analyze-site` | `.claude/commands/analyze-site.md` | Analyze the live site and update `site.config.json` |
| `/generate-full-suite` | `.claude/commands/generate-full-suite.md` | Generate the complete POM + test suite |
| `/run-smoke` | `.claude/commands/run-smoke.md` | Run smoke tests and display a pass/fail summary |
| `/update-baseline` | `.claude/commands/update-baseline.md` | Refresh visual regression baseline screenshots |
| `/generate-report` | `.claude/commands/generate-report.md` | Generate a structured test results summary |

---

## /analyze-site

**Usage:** `/analyze-site [url]`

Navigates to the site, inspects its structure, and outputs a fully-populated `site.config.json`. If no URL is provided, reads the `url` field from the existing `site.config.json`.

**What it inspects:**

- Page `<title>` and `<meta name="description">`
- Primary navigation links (text + href)
- Form elements with email fields
- H1 / main heading text
- Primary CTA button text
- HTTPS presence and redirect resolution
- Favicon presence
- Horizontal overflow at 390px viewport (responsiveness check)

**Output:** A `site.config.json` JSON block followed by an issues checklist:

```json
{
  "name": "Deliver EZ",
  "url": "http://www.deliver-ez.com",
  "description": "<meta description content>",
  "industry": "<inferred>",
  "hasContactForm": true,
  "expectedNavItems": ["Home", "Features", "Contact"],
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false, "loginUrl": "", "username": "", "password": "" }
}
```

---

## /generate-full-suite

**Usage:** `/generate-full-suite`

Analyzes the live site (invokes the `site-analyzer` agent if needed), then generates or updates:

- Page object classes in `src/pages/`
- Smoke tests in `tests/smoke/`
- Navigation tests in `tests/navigation/`
- Form tests in `tests/forms/`
- Functional tests in `tests/functional/`
- Visual regression tests in `tests/visual/`
- Responsive layout tests in `tests/responsive/`

**Pre-requisites:** `site.config.json` must have a valid `url` field. Run `/analyze-site` first if `expectedNavItems` is empty.

**Steps Claude follows:**

1. Read and validate `site.config.json`
2. Fetch the live site to inspect actual selectors
3. Create/update page object classes based on discovered HTML
4. Generate spec files for each test category
5. Run `npx tsc --noEmit` to verify TypeScript compiles cleanly
6. Report what was created and any selectors that may need manual verification

---

## /run-smoke

**Usage:** `/run-smoke`

Runs `npm run test:smoke` and displays a formatted pass/fail table.

**Output format:**

```
Site: Deliver EZ (http://www.deliver-ez.com)
Run: <timestamp>   Duration: <total>

+--------------------------------------------------+--------+----------+
| Test                                             | Status | Duration |
+--------------------------------------------------+--------+----------+
| site homepage loads successfully                 | PASS   | 1.2s     |
| page loads within acceptable time               | PASS   | 3.4s     |
| no critical JavaScript errors on load            | PASS   | 2.1s     |
+--------------------------------------------------+--------+----------+
Total: 3   Passed: 3   Failed: 0
```

For any failures, Claude shows the error and a suggested fix. Exit code mirrors the underlying test runner (0 = all pass, 1 = any failure).

---

## /update-baseline

**Usage:** `/update-baseline`

Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`) and lists all updated files in `__snapshots__/`.

**When to use:**

- After an intentional site redesign or content update
- After changing viewport sizes in `playwright.config.ts`
- On the first run in a fresh clone (no baselines exist yet)

**Important:** Review every updated screenshot before committing. Visual tests skip (not fail) when no baseline exists — run this command to create them.

---

## /generate-report

**Usage:** `/generate-report`

Parses `test-results/results.json` and displays:

- Summary table by suite: Total / Passed / Failed / Flaky
- All failed tests with error messages
- All flaky tests with suggestions
- Suggested next steps (fix broken links, re-run flaky tests, update baselines)

**Requires:** `npm test` must have run first. If `results.json` is missing, Claude prompts you to run tests.

---

## Adding a New Skill

1. Create a `.md` file in `.claude/commands/`
2. Start with a `# /command-name` heading
3. Document: usage, numbered steps, output format, edge cases
4. Add a row to the table above in this file
5. Test by typing `/command-name` in a Claude Code session

See the [Claude Code skills documentation](https://code.claude.com/docs/en/skills) for the full specification.
