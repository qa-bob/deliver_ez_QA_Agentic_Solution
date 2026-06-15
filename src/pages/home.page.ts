/**
 * src/pages/home.page.ts
 *
 * HomePage models the Deliver EZ root/homepage.
 * Uses Wix-aware selectors (the site is built on Wix) with semantic fallbacks
 * so the suite degrades gracefully if the site ever migrates platforms.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class HomePage extends BasePage {
  // ── Header ───────────────────────────────────────────────────────────────────
  /** Site header — Wix uses #SITE_HEADER, fallback to <header> */
  readonly header: Locator;

  // ── Hero / main heading ──────────────────────────────────────────────────────
  /** First <h1> on the page */
  readonly mainHeadingEl: Locator;
  /**
   * Tagline element — matches known Deliver EZ copy:
   * "Your package your way 24/7" or "Smart Community" or the brand name.
   */
  readonly taglineEl: Locator;

  // ── Content sections ─────────────────────────────────────────────────────────
  /** All top-level content sections (Wix mesh containers or HTML sections) */
  readonly contentSections: Locator;
  /** Feature / benefit headings in the body of the page */
  readonly featureHeadings: Locator;

  // ── CTA buttons ──────────────────────────────────────────────────────────────
  /**
   * Any link or button whose text matches a common conversion phrase.
   * Logistics / delivery SaaS typical CTAs: "Get Started", "Contact Us",
   * "Download", "App Store", "Google Play", "Learn More".
   */
  readonly ctaButtons: Locator;

  // ── Footer ───────────────────────────────────────────────────────────────────
  /** Site footer — Wix uses #SITE_FOOTER, fallback to <footer> */
  readonly footer: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.header = page.locator('#SITE_HEADER, header').first();

    this.mainHeadingEl = page.locator('h1').first();

    this.taglineEl = page
      .locator('h1, h2, h3, p')
      .filter({
        hasText: /your package|package your way|24.?7|deliver.{0,5}ez|smart community|logistics/i,
      })
      .first();

    // Wix wraps page content in #PAGES_CONTAINER; each section is a direct child.
    // Falls back to standard <section> elements.
    this.contentSections = page.locator(
      '#PAGES_CONTAINER > *, section, [data-mesh-id]'
    );

    this.featureHeadings = page.locator(
      '#PAGES_CONTAINER h2, #PAGES_CONTAINER h3, ' +
      'main h2, main h3, section h2, section h3'
    );

    this.ctaButtons = page.locator('a, button').filter({
      hasText:
        /get started|contact us|contact|download|app store|google play|sign up|try free|learn more|request demo/i,
    });

    this.footer = page.locator('#SITE_FOOTER, footer, [role="contentinfo"]').first();
  }

  // ── Hero / above-the-fold ────────────────────────────────────────────────────

  /**
   * Return the text content of the hero / banner section.
   * Tries common hero patterns in descending specificity.
   */
  async getHeroText(): Promise<string> {
    const candidates = [
      this.page.getByRole('banner').first(),
      this.page.locator('[data-testid="hero"]').first(),
      this.page.locator('section').first(),
      this.header,
    ];

    for (const candidate of candidates) {
      if ((await candidate.count()) > 0) {
        const text = await candidate.textContent();
        if (text && text.trim().length > 0) return text.trim();
      }
    }

    return '';
  }

  // ── CTAs ─────────────────────────────────────────────────────────────────────

  /**
   * Return all visible CTA buttons/links on the page.
   * Falls back to class-name heuristics if text matching returns nothing.
   */
  async getCTAButtons(): Promise<Locator[]> {
    const byText = await this.ctaButtons.all();
    if (byText.length > 0) return byText;

    const byClass = this.page.locator(
      'a[class*="btn"], a[class*="button"], a[class*="cta"], ' +
        'button[class*="primary"], button[class*="cta"], [role="button"]'
    );
    return byClass.all();
  }

  // ── Headings ─────────────────────────────────────────────────────────────────

  /**
   * Return the text of the first <h1> on the page.
   * Falls back to first <h2> when no <h1> is rendered (some SPAs skip h1 on load).
   */
  async getMainHeading(): Promise<string> {
    if ((await this.mainHeadingEl.count()) > 0) {
      return (await this.mainHeadingEl.textContent())?.trim() ?? '';
    }

    const h2 = this.page.locator('h2').first();
    if ((await h2.count()) > 0) {
      return (await h2.textContent())?.trim() ?? '';
    }

    return '';
  }

  // ── Load verification ─────────────────────────────────────────────────────────

  /**
   * Returns true when the page appears fully rendered:
   *  - at least one heading exists
   *  - at least one nav element exists
   *  - body has meaningful text content
   */
  async isLoaded(): Promise<boolean> {
    try {
      if ((await this.page.locator('h1, h2').count()) === 0) return false;
      if ((await this.page.locator('nav, [role="navigation"]').count()) === 0) return false;

      const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
      if (bodyText.trim().length < 50) return false;

      return true;
    } catch {
      return false;
    }
  }
}
