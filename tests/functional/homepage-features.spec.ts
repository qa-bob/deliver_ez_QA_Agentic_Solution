/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for the Deliver EZ homepage.
 *
 * Deliver EZ is a Smart Community Logistics platform (Phoenix, AZ).
 * The homepage should present:
 *  - A primary heading describing the service
 *  - The brand identity ("Deliver EZ" or the tagline "Your package your way 24/7")
 *  - At least one section of feature/benefit content
 *  - At least one CTA (Contact, Download, Learn More, Get Started, etc.)
 *  - A footer with navigation or legal content
 *
 * These tests use resilient selectors because the site runs on Wix and its
 * DOM structure can shift without a code change.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Features @functional', () => {
  // homePage fixture auto-navigates to siteConfig.url

  // ── Heading ───────────────────────────────────────────────────────────────────

  test('homepage has a primary heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(
      heading.length,
      'Homepage should have a visible h1 or h2 heading with meaningful text'
    ).toBeGreaterThan(0);
  });

  test('homepage heading is not a placeholder @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    // Reject obviously placeholder text
    const placeholderPhrases = /lorem ipsum|placeholder|coming soon|under construction|untitled/i;
    expect(
      placeholderPhrases.test(heading),
      `Heading appears to be placeholder text: "${heading}"`
    ).toBeFalsy();
  });

  // ── Brand identity ────────────────────────────────────────────────────────────

  test('Deliver EZ brand name or tagline is present on the page @functional', async ({
    homePage,
  }) => {
    const bodyText = await homePage.page.evaluate<string>(() => document.body.innerText);
    const hasBrand =
      /deliver.{0,5}ez|your package|package your way|24.?7|smart community/i.test(bodyText);

    expect(
      hasBrand,
      'Homepage body should contain the brand name "Deliver EZ", the tagline ' +
        '"Your package your way 24/7", or "Smart Community" copy'
    ).toBeTruthy();
  });

  // ── Content sections ──────────────────────────────────────────────────────────

  test('homepage has at least two content sections @functional', async ({ homePage }) => {
    const sectionCount = await homePage.contentSections.count();
    expect(
      sectionCount,
      'Homepage should have at least 2 distinct content sections (hero + one feature section minimum)'
    ).toBeGreaterThanOrEqual(2);
  });

  test('homepage has at least one sub-heading describing features @functional', async ({
    homePage,
  }) => {
    const headingCount = await homePage.featureHeadings.count();

    if (headingCount === 0) {
      // If no h2/h3 found in known containers, check the full page
      const allH2 = await homePage.page.locator('h2').count();
      const allH3 = await homePage.page.locator('h3').count();
      expect(
        allH2 + allH3,
        'Homepage should have at least one h2 or h3 describing features or benefits'
      ).toBeGreaterThan(0);
    } else {
      expect(headingCount).toBeGreaterThan(0);
    }
  });

  // ── CTA buttons ───────────────────────────────────────────────────────────────

  test('homepage has at least one call-to-action @functional', async ({ homePage }) => {
    const ctas = await homePage.getCTAButtons();
    expect(
      ctas.length,
      'Homepage should have at least one CTA button or link ' +
        '(Get Started, Contact, Download, Learn More, etc.)'
    ).toBeGreaterThan(0);
  });

  test('CTA buttons have non-empty link text @functional', async ({ homePage }) => {
    const ctas = await homePage.getCTAButtons();
    test.skip(ctas.length === 0, 'No CTA buttons found');

    for (const cta of ctas) {
      const text = ((await cta.textContent()) ?? '').trim();
      expect(
        text.length,
        'Each CTA button/link should have visible non-empty text'
      ).toBeGreaterThan(0);
    }
  });

  // ── Footer ─────────────────────────────────────────────────────────────────────

  test('footer is present on the homepage @functional', async ({ homePage }) => {
    await expect(
      homePage.footer,
      'Page should have a footer element (#SITE_FOOTER, <footer>, or role="contentinfo")'
    ).toBeVisible({ timeout: 10_000 });
  });

  test('footer has content @functional', async ({ homePage }) => {
    await homePage.footer.scrollIntoViewIfNeeded();
    const footerText = (await homePage.footer.textContent()) ?? '';
    expect(
      footerText.trim().length,
      'Footer should contain some text (links, copyright, address, etc.)'
    ).toBeGreaterThan(0);
  });

  // ── Images ─────────────────────────────────────────────────────────────────────

  test('hero/above-the-fold section has an image or meaningful heading @functional', async ({
    homePage,
  }) => {
    const heroText = await homePage.getHeroText();
    const hasHeroContent = heroText.trim().length > 10;

    const heroImages = await homePage.page.locator('img').count();

    expect(
      hasHeroContent || heroImages > 0,
      'The above-the-fold area should have either meaningful text content or an image'
    ).toBeTruthy();
  });

  // ── Performance guard ─────────────────────────────────────────────────────────

  test('homepage body has meaningful text content @functional', async ({ homePage }) => {
    const bodyText = await homePage.page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Page body should contain at least 100 characters of visible text'
    ).toBeGreaterThanOrEqual(100);
  });
});
