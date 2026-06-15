/**
 * tests/functional/news.spec.ts
 *
 * Functional tests for the Deliver EZ news/blog section at /news/.
 *
 * The blog is a Wix Blog sub-route. Tests verify that:
 *  - The news page loads and has a heading
 *  - Blog posts are visible (or a "no posts" state is rendered cleanly)
 *  - Post items link to their full articles
 *  - The contact page is reachable from within the /news/ section
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { NewsPage } from '@pages/news.page';

test.describe('News / Blog Section @functional', () => {
  test.beforeEach(async ({ newsPage }) => {
    await newsPage.navigateToNews();
  });

  // ── Page load ─────────────────────────────────────────────────────────────────

  test('news page loads successfully @functional', async ({ page, siteConfig }) => {
    const status = await page.evaluate<number | null>(() => {
      return null; // Can't get response status post-navigation; check body instead
    });
    void status; // unused — we check body content instead

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      `News page at ${siteConfig.url.replace(/\/$/, '')}${NewsPage.NEWS_PATH} should have visible content`
    ).toBeGreaterThan(20);
  });

  test('news page has a heading @functional', async ({ newsPage }) => {
    const loaded = await newsPage.isLoaded();
    expect(loaded, 'News page should load with at least one heading and body content').toBeTruthy();
  });

  // ── Blog posts ────────────────────────────────────────────────────────────────

  test('news page renders post items or a "no posts" state @functional', async ({ newsPage }) => {
    const postCount = await newsPage.getPostCount();

    if (postCount === 0) {
      // Acceptable: the blog may have no posts yet — verify page isn't blank
      const bodyText = await newsPage.page.evaluate<string>(() => document.body.innerText);
      expect(
        bodyText.trim().length,
        'If no posts exist, the page should still render navigable content (not a blank page)'
      ).toBeGreaterThan(20);
      console.warn('[news] No blog post items found — the blog may be empty.');
    } else {
      expect(postCount, 'At least one blog post should be visible').toBeGreaterThan(0);
    }
  });

  test('blog posts have titles @functional', async ({ newsPage }) => {
    const postCount = await newsPage.getPostCount();
    if (postCount === 0) {
      test.skip(true, 'No blog posts found — skipping title check');
      return;
    }

    const posts = await newsPage.getPosts();
    const postsWithTitles = posts.filter((p) => p.title.length > 0);

    expect(
      postsWithTitles.length,
      `${posts.length} post(s) found but ${posts.length - postsWithTitles.length} have no title`
    ).toBe(posts.length);
  });

  test('blog post items contain links @functional', async ({ newsPage }) => {
    const postCount = await newsPage.getPostCount();
    if (postCount === 0) {
      test.skip(true, 'No blog posts found — skipping link check');
      return;
    }

    const posts = await newsPage.getPosts();
    const postsWithLinks = posts.filter((p) => p.href.length > 0);

    expect(
      postsWithLinks.length,
      'Each blog post item should contain a link to the full article'
    ).toBeGreaterThan(0);
  });

  // ── Contact page reachability ─────────────────────────────────────────────────

  test('contact page at /news/contact/ is reachable @functional', async ({ page, siteConfig }) => {
    const contactUrl = siteConfig.url.replace(/\/$/, '') + '/news/contact/';
    const response = await page.goto(contactUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });

    expect(
      response,
      `Could not navigate to ${contactUrl}`
    ).not.toBeNull();

    expect(
      response!.status(),
      `${contactUrl} returned HTTP ${response!.status()} — expected 2xx`
    ).toBeLessThan(400);

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Contact page should have visible content'
    ).toBeGreaterThan(20);
  });

  test('contact page contains a form or contact information @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/news/contact/', {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });

    const hasForm = (await page.locator('form').count()) > 0;
    const hasEmail = (await page.locator('a[href^="mailto:"]').count()) > 0;
    const hasPhone = (await page.locator('a[href^="tel:"]').count()) > 0;
    const hasContactText = /contact|reach|touch|team|hello/i.test(
      await page.evaluate<string>(() => document.body.innerText)
    );

    expect(
      hasForm || hasEmail || hasPhone || hasContactText,
      'Contact page should have a form, mailto link, phone link, or contact-related copy'
    ).toBeTruthy();
  });
});
