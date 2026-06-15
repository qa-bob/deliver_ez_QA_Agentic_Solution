/**
 * src/pages/news.page.ts
 *
 * NewsPage models the Deliver EZ news/blog section at /news/.
 * The blog is hosted as a Wix Blog sub-route, so selectors target
 * both Wix-specific patterns and standard semantic HTML fallbacks.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export interface PostSummary {
  title: string;
  href: string;
}

export class NewsPage extends BasePage {
  /** Root-relative path to the news/blog section */
  static readonly NEWS_PATH = '/news/';

  // ── Post list ─────────────────────────────────────────────────────────────────
  /** Container wrapping the list of blog posts */
  readonly postListContainer: Locator;
  /**
   * Individual post items.
   * Wix Blog uses data-testid="postListItem"; falls back to <article> elements.
   */
  readonly postItems: Locator;
  /** Page heading (h1 or first h2) */
  readonly pageHeading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.postListContainer = page
      .locator(
        '[data-testid="postList"], [data-testid="postListWrapper"], ' +
          '.blog-post-list, #PAGES_CONTAINER, main'
      )
      .first();

    this.postItems = page.locator(
      '[data-testid="postListItem"], [data-testid="postItem"], ' +
        'article[class*="post"], [class*="post-item"], [class*="blog-item"], ' +
        'article'
    );

    this.pageHeading = page.locator('h1, h2').first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  /** Navigate directly to the /news/ path. */
  async navigateToNews(): Promise<void> {
    const url = this.config.url.replace(/\/$/, '') + NewsPage.NEWS_PATH;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  // ── Post data ─────────────────────────────────────────────────────────────────

  /** Return the number of post items visible in the list. */
  async getPostCount(): Promise<number> {
    return this.postItems.count();
  }

  /**
   * Return an array of { title, href } for each visible post.
   * Titles are taken from h2/h3/[class*="title"] inside each post item.
   * hrefs are taken from the first <a> inside each post item.
   */
  async getPosts(): Promise<PostSummary[]> {
    const count = await this.postItems.count();
    const posts: PostSummary[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.postItems.nth(i);

      const titleEl = item.locator('h2, h3, [class*="title"], [class*="post-title"]').first();
      const title = ((await titleEl.textContent()) ?? '').trim();

      const linkEl = item.locator('a[href]').first();
      const href = (await linkEl.getAttribute('href')) ?? '';

      if (title || href) {
        posts.push({ title, href });
      }
    }

    return posts;
  }

  // ── Load verification ──────────────────────────────────────────────────────────

  /** Returns true when the news page appears to have loaded its content. */
  async isLoaded(): Promise<boolean> {
    try {
      if ((await this.pageHeading.count()) === 0) return false;

      const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
      return bodyText.trim().length > 20;
    } catch {
      return false;
    }
  }
}
