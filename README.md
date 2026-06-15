# Deliver EZ — QA Agentic Test Suite

Automated smoke, functional, and regression test suite for [deliver-ez.com](http://www.deliver-ez.com/) built with **Playwright + TypeScript**, following the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles.

This repository is structured for both human contributors and AI-assisted development via **Claude Code**, Anthropic's agentic coding assistant.

---

## Repository Purpose

This suite tests the Deliver EZ website across desktop, tablet, and mobile viewports — without creating accounts, submitting forms, or taking any destructive actions.

**Coverage goals:**

- All navigable pages and routes
- Navigation menus, links, and routing behavior
- Contact form field interactions and validation (no submission)
- Business features and interactive elements
- Visual regression across three viewport sizes
- Responsive layout at mobile (390px), tablet (768px), and desktop (1280px)

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation |
| TypeScript | ^5.4 | Strongly-typed test code |
| Node.js | >=18 | Runtime |
| ESLint | ^8.57 | Code quality |
| GitHub Actions | — | CI/CD pipeline |
| Claude Code | latest | AI-assisted test generation |

---

## Development Environment Setup

### Prerequisites

- **Node.js** 18 or higher — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)
- **Claude Code** (optional, for AI-assisted workflows) — [code.claude.com](https://code.claude.com/)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd deliver_ez_QA_Agentic_Solution

# 2. Install Node.js dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. (Optional) Copy the environment file
cp .env.example .env
```

### Running Tests

```bash
npm test                   # Run all tests (all browsers, all viewports)
npm run test:smoke         # Smoke tests only (@smoke)
npm run test:navigation    # Navigation tests only (@navigation)
npm run test:forms         # Form tests only (@forms)
npm run test:visual        # Visual regression tests only (@visual)
npm run test:responsive    # Responsive layout tests only (@responsive)
npm run test:headed        # Run with a visible browser window
npm run report             # Open the HTML test report in the browser
npm run baseline           # Capture new visual regression baselines
npm run typecheck          # TypeScript type-check (no emit)
npm run lint               # ESLint across src/ and tests/
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SITE_URL` | (from `site.config.json`) | Override the target URL at runtime |
| `CI` | — | Set by GitHub Actions; enables retries and restricts workers |

---

## Architecture

### Page Object Model (POM)

Every page or major UI section is represented by a **Page Object class** in `src/pages/`. This decouples element locators and user actions from test assertions.

```
src/pages/
├── base.page.ts        # BasePage — shared methods for all pages
├── home.page.ts        # HomePage extends BasePage
├── navigation.page.ts  # NavigationPage extends BasePage
├── contact.page.ts     # ContactFormPage extends BasePage
└── <feature>.page.ts   # One class per additional page/section
```

**POM Rules:**

- All page objects extend `BasePage`
- Locators are `readonly Locator` properties declared on the class
- Methods model user actions (click, fill, hover) — never assertions
- No `expect()` calls inside page objects
- Tests import page objects via `src/fixtures/site.fixture.ts`

### OOP Concepts Applied

| Concept | Where |
|---------|-------|
| **Inheritance** | All page classes extend `BasePage` |
| **Encapsulation** | Locators and actions encapsulated in page classes, not exposed to tests |
| **Abstraction** | `BasePage` provides shared navigate/screenshot/console-error utilities |
| **Composition** | `site.fixture.ts` composes multiple page objects into one test fixture |

### Project Structure

```
deliver_ez_QA_Agentic_Solution/
├── site.config.json           # Site URL, feature flags (hasContactForm, etc.)
├── playwright.config.ts       # Browser projects, reporters, snapshot config
├── global-setup.ts            # Pre-run site reachability check
├── CLAUDE.md                  # Claude Code project instructions (loaded every session)
├── AGENTS.md                  # AI agent documentation
├── Skills.md                  # Claude Code slash-command reference
├── src/
│   ├── pages/                 # Page Object Model classes
│   ├── fixtures/
│   │   └── site.fixture.ts    # Custom Playwright test fixtures
│   ├── utils/
│   │   ├── link-checker.ts    # HTTP link validation helper
│   │   └── visual-helper.ts   # Screenshot utilities
│   └── types/
│       └── site-config.types.ts
├── tests/
│   ├── smoke/                 # @smoke — availability checks
│   ├── navigation/            # @navigation — routing and menus
│   ├── forms/                 # @forms — field and validation tests
│   ├── functional/            # @functional — business feature tests
│   ├── visual/                # @visual — screenshot regression
│   └── responsive/            # @responsive — layout at each viewport
├── .claude/
│   ├── agents/                # Claude Code sub-agent definitions
│   ├── commands/              # Slash command (.md) definitions
│   └── rules/                 # Path-scoped Claude Code rules
└── .github/
    ├── workflows/
    │   └── playwright.yml     # GitHub Actions CI pipeline
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md      # Template for test failure reports
    │   └── feature_request.md # Template for new test coverage requests
    ├── PULL_REQUEST_TEMPLATE.md
    ├── CONTRIBUTING.md        # Contribution guidelines
    └── copilot-instructions.md# GitHub Copilot coding instructions
```

---

## Test Categories

| Tag | Location | What it tests |
|-----|----------|---------------|
| `@smoke` | `tests/smoke/` | Site loads, title present, no console errors, HTTPS |
| `@navigation` | `tests/navigation/` | Nav links reachable, routing, menu behavior |
| `@forms` | `tests/forms/` | Field interactions and validation (no submission) |
| `@functional` | `tests/functional/` | Business features: CTAs, accordions, videos, sections |
| `@visual` | `tests/visual/` | Screenshot regression via `toHaveScreenshot()` |
| `@responsive` | `tests/responsive/` | Layout correctness at mobile/tablet/desktop |

---

## Claude Code Integration

This repo is structured for AI-assisted development with [Claude Code](https://code.claude.com/). `CLAUDE.md` provides persistent project instructions loaded at the start of every Claude Code session.

### Agents

Sub-agents in `.claude/agents/` handle specialized tasks automatically:

| Agent | Purpose |
|-------|---------|
| `site-analyzer` | Crawls the live site and updates `site.config.json` |
| `test-generator` | Generates site-specific Playwright tests for discovered features |

See [AGENTS.md](./AGENTS.md) for full documentation.

### Skills (Slash Commands)

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Inspect site structure and update `site.config.json` |
| `/generate-full-suite` | Generate the complete POM + test suite |
| `/run-smoke` | Run smoke tests and display a pass/fail summary |
| `/update-baseline` | Refresh visual regression baseline screenshots |
| `/generate-report` | Generate a structured test results summary |

See [Skills.md](./Skills.md) for full documentation.

---

## .github Folder

| File/Folder | Purpose |
|-------------|---------|
| `workflows/playwright.yml` | CI pipeline: runs all tests on push and pull request |
| `CONTRIBUTING.md` | How to contribute code and tests to this repo |
| `PULL_REQUEST_TEMPLATE.md` | PR checklist enforcing test and type-check requirements |
| `ISSUE_TEMPLATE/bug_report.md` | Template for reporting test failures or broken selectors |
| `ISSUE_TEMPLATE/feature_request.md` | Template for requesting new test coverage |
| `copilot-instructions.md` | GitHub Copilot instructions (mirrors CLAUDE.md rules) |

---

## Contributor Rules

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide. Quick reference:

1. **Never submit forms** — test fields and validation only
2. **Never hardcode the base URL** — use `baseURL` from Playwright config
3. **Follow POM** — locators and actions go in `src/pages/`, not in spec files
4. **Tag every test** — at least one of `@smoke @navigation @forms @functional @visual @responsive`
5. **No assertions in page objects** — `expect()` belongs in spec files only
6. **TypeScript strict** — `npm run typecheck` must exit 0 before opening a PR
7. **No `page.waitForTimeout()`** — use Playwright's auto-waiting or `waitForSelector`
8. **No `any` type** — every `as unknown` or `as any` requires a comment explaining why
9. **One page object per page/section** — avoid mixing concerns in one class
10. **Tests pass before PRs** — `npm test` must exit 0 on your branch

### Commit Message Convention

```
<type>(<scope>): <short description>

type:   feat | fix | test | refactor | chore | docs
scope:  smoke | navigation | forms | functional | visual | responsive | pom | config
```

Example: `test(functional): add CTA button visibility assertions for homepage`

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions (`.github/workflows/playwright.yml`). The pipeline:

1. Installs Node.js dependencies and Playwright browsers
2. Runs the full test suite against `http://www.deliver-ez.com/`
3. Uploads the Playwright HTML report as a build artifact
4. Fails the check if any test fails

---

## Visual Regression

Baseline screenshots live in `__snapshots__/`. On a fresh clone or after intentional design changes:

```bash
npm run baseline         # Capture/update all visual baselines
```

Review every updated screenshot before committing. Use `/update-baseline` in Claude Code for a guided workflow with a diff summary.

---

*This repository is part of the Phoenix Startup QA Agentic Solutions project.*
