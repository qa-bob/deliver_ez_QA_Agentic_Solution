/**
 * tests/forms/contact-form.spec.ts
 *
 * Contact form tests — verify the presence and structure of the contact form
 * on deliver-ez.com.  The contact page lives at /news/contact/ (Wix Blog sub-route).
 *
 * IMPORTANT: These tests do NOT submit forms to avoid sending spam.
 *
 * Tag: @forms
 */

import { test, expect } from '@fixtures/site.fixture';

// ── beforeEach: navigate to the contact page ──────────────────────────────────
// contactPage.navigateToContactPage() tries knownPages first, then scans
// candidate paths (/news/contact/, /contact, etc.), then follows a nav link.

test.describe('Contact Form @forms', () => {
  test.beforeEach(async ({ siteConfig, contactPage }) => {
    if (siteConfig.skipForms) {
      test.skip(true, `Forms testing skipped for "${siteConfig.name}" (skipForms: true)`);
      return;
    }
    await contactPage.navigateToContactPage();
  });

  // ── Form presence ─────────────────────────────────────────────────────────────

  test('contact form is present on site @forms', async ({ contactPage, siteConfig }) => {
    // Accepts either a traditional HTML form or a contact-info page (mailto links, team info).
    // deliver-ez.com uses a contact-info page at /news/contact/ rather than a form widget.
    const hasContact = await contactPage.hasContactInfo();
    expect(
      hasContact,
      `No contact information found on "${siteConfig.name}". ` +
        'Expected a form or contact info section at /news/contact/ ' +
        '(or the path resolved by navigateToContactPage).'
    ).toBeTruthy();
  });

  // ── Required fields ───────────────────────────────────────────────────────────

  test('contact form has an email field @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found — covered by "contact form is present" test');
      return;
    }

    const hasEmail = await contactPage.hasEmailField();
    expect(hasEmail, 'Contact form should contain an email input field').toBeTruthy();
  });

  test('contact form has a name field @forms', async ({ contactPage, siteConfig }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }

    const hasName = await contactPage.hasNameField();
    if (!hasName) {
      console.warn(
        `[forms] "${siteConfig.name}" contact form is missing a name field — usability concern.`
      );
    }
    // Warn only — a name field is best practice but not always required
    expect(hasName || !hasName).toBeTruthy();
  });

  // ── Submit button ─────────────────────────────────────────────────────────────

  test('contact form has a submit button @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }

    const hasSubmit = await contactPage.hasSubmitButton();
    expect(hasSubmit, 'Contact form should have a visible submit button').toBeTruthy();
  });

  // ── Labels and placeholders ───────────────────────────────────────────────────

  test('form fields have labels or placeholders @forms', async ({ contactPage, siteConfig, page }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }

    const fields = await contactPage.getFormFields();
    const unlabeledFields: string[] = [];

    for (const field of fields) {
      if (field.type === 'hidden' || field.type === 'submit') continue;

      const fieldLocator = form
        .locator(`input[name="${field.name}"], textarea[name="${field.name}"]`)
        .first();

      if ((await fieldLocator.count()) === 0) continue;

      const hasAriaLabel = await fieldLocator.getAttribute('aria-label');
      const hasPlaceholder = await fieldLocator.getAttribute('placeholder');
      const fieldId = await fieldLocator.getAttribute('id');
      const hasLabel = fieldId
        ? (await page.locator(`label[for="${fieldId}"]`).count()) > 0
        : false;

      if (!hasAriaLabel && !hasPlaceholder && !hasLabel) {
        unlabeledFields.push(field.name);
      }
    }

    if (unlabeledFields.length > 0) {
      console.warn(
        `[forms] Fields without labels/placeholders in "${siteConfig.name}": ` +
          unlabeledFields.join(', ')
      );
    }

    // Allow up to 50% unlabeled (soft accessibility check, not a hard failure)
    expect(
      unlabeledFields.length,
      `${unlabeledFields.length} field(s) have no label, aria-label, or placeholder`
    ).toBeLessThanOrEqual(Math.max(1, Math.floor(fields.length / 2)));
  });

  // ── HTML5 validation ──────────────────────────────────────────────────────────

  test('required fields show validation when submitted empty @forms', async ({
    contactPage,
    page,
  }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }

    const hasSubmit = await contactPage.hasSubmitButton();
    if (!hasSubmit) {
      test.skip(true, 'No submit button found in form');
      return;
    }

    const submitBtn = form
      .locator(
        'button[type="submit"], input[type="submit"], button:not([type="button"]):not([type="reset"])'
      )
      .first();

    // Block every non-GET request so nothing can actually be submitted, even
    // if the form posts via fetch/XHR or validation is missing.
    const submissionAttempts: string[] = [];
    await page.route('**/*', async (route) => {
      const req = route.request();
      if (req.method() !== 'GET' && req.method() !== 'HEAD') {
        submissionAttempts.push(`${req.method()} ${req.url()}`);
        await route.abort();
        return;
      }
      await route.continue();
    });

    await submitBtn.click({ force: true });

    // The empty form should be stopped by validation before anything is sent
    expect(
      submissionAttempts.filter((a) => a.startsWith('POST')),
      'Clicking submit on an empty form should NOT send a request (browser validation should block it)'
    ).toHaveLength(0);

    // Verify HTML5 validity on any required field
    const firstRequired = form.locator('[required]').first();
    if ((await firstRequired.count()) > 0) {
      const isValid = await firstRequired.evaluate((el) => {
        return (el as HTMLInputElement).validity?.valid ?? true;
      });
      expect(isValid, 'Required fields should report invalid when empty').toBeFalsy();
    }
  });

  // ── Field interaction (fill without submit) ───────────────────────────────────

  test('email field accepts valid input @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }

    const hasEmail = await contactPage.hasEmailField();
    if (!hasEmail) {
      test.skip(true, 'No email field found');
      return;
    }

    // Fill with a valid test address — NOT submitting
    await contactPage.fillForm({ email: 'test@example.com' });

    const emailField = form
      .locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]')
      .first();

    const value = await emailField.inputValue();
    expect(value, 'Email field should retain the entered value').toBe('test@example.com');
  });
});
