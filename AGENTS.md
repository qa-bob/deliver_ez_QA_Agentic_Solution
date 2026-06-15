# Agents

This repository uses AI agents in two categories:

1. **Claude Code sub-agents** — defined in `.claude/agents/`, invoked automatically when you run slash commands or when Claude Code determines the task matches the agent's description
2. **GitHub Copilot** — instructions in `.github/copilot-instructions.md`

For Claude Code configuration and project-level instructions, see [CLAUDE.md](./CLAUDE.md).

---

## Claude Code Sub-Agents

Sub-agents run in their own context window with a specialized system prompt and scoped tool access. Claude Code delegates tasks to them automatically based on the `When to invoke` section of each agent definition.

### site-analyzer

**File:** `.claude/agents/site-analyzer.md`

**Invoked when:** Running `/analyze-site`, onboarding the repo to a new site, or verifying that `site.config.json` is still accurate after a redesign.

**What it does:**

- Issues a HEAD request to resolve the canonical URL (follows all redirects)
- Navigates with `waitUntil: 'networkidle'` and dismisses cookie consent banners
- Extracts nav link text and hrefs from `nav a[href]` and `[role="navigation"] a[href]`
- Checks for contact forms on the current page and at `/contact`, `/contact-us`, `/get-in-touch`
- Infers the industry from `<h1>`, `<h2>`, and `<p>` content
- Checks for horizontal overflow at 390px viewport
- Determines `auth.required` by detecting login redirects
- Determines `skipVisual` by detecting heavy CSS animations or rotating content

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `url` | Yes | The site URL to analyze |
| `companyName` | No | Override for the company name (else inferred from `<title>`) |

**Output:** A fully-populated `site.config.json` block + an issues checklist + a confidence rating (High / Medium / Low).

**Edge cases handled:** SPAs, auth-gated content, redirect chains, cookie banners, lazy-loaded nav.

---

### test-generator

**File:** `.claude/agents/test-generator.md`

**Invoked when:** Running `/generate-full-suite`, or when the site has unique functionality not covered by the shared test suites.

**What it does:**

- Reads `site.config.json` to understand site structure and feature flags
- Identifies gaps relative to the generic test suites in `tests/`
- Creates or extends page objects in `src/pages/`
- Generates TypeScript spec files in `tests/custom/`
- Tags all generated tests appropriately (`@smoke`, `@navigation`, etc., plus `@custom`)
- Validates: each test is independent, uses proper waits, has a clear assertion

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `siteConfig` | Yes | The populated `site.config.json` for the target site |
| `testScenarios` | No | Description of specific scenarios to cover |
| `pagesToTest` | No | Specific page paths (e.g., `/features`, `/pricing`) |

**Output:** TypeScript spec files written to `tests/custom/<scenario-name>.spec.ts`.

---

## Rules for Agent-Generated Code

All code produced by agents must pass the same standards as human-written code:

- Page objects extend `BasePage` from `src/pages/base.page.ts`
- Locators are `readonly Locator` class properties, not inline in methods
- No `expect()` inside page object methods — assertions belong in spec files
- All tests tagged with at least one appropriate `@tag`
- No hardcoded base URL — use `baseURL` from Playwright config
- TypeScript strict mode enforced (`tsconfig.json`) — no implicit `any`
- No `page.waitForTimeout()` — use Playwright auto-waiting or `waitForSelector`
- No form submission, no account creation, no real credentials

---

## GitHub Copilot

Instructions for GitHub Copilot are in `.github/copilot-instructions.md`. They mirror the key rules from `CLAUDE.md` so both AI tools enforce the same conventions.

---

## Adding a New Agent

1. Create a `.md` file in `.claude/agents/`
2. Include these sections: **Role**, **When to invoke**, **Capabilities**, **Inputs** (table), **Output**, **Step-by-step instructions**, **Edge cases**
3. Add a row to the tables above
4. Test by triggering the agent from a Claude Code session and verifying the output

See the [Claude Code sub-agents documentation](https://code.claude.com/docs/en/sub-agents) for the full specification.
