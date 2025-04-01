import type { Locator, Page } from '@playwright/test';

export class CmsValueField {
  readonly locator: Locator;
  readonly label: Locator;
  readonly delete: Locator;
  readonly textbox: Locator;

  constructor(page: Page, parent: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parent.locator('.cms-editor-value-field').filter({ has: page.locator('label').filter({ hasText: options.label }) });
    } else {
      this.locator = parent.locator('.cms-editor-value-field').nth(options?.nth ?? 0);
    }
    this.label = this.locator.locator('label');
    this.delete = this.locator.getByRole('button');
    this.textbox = this.locator.getByRole('textbox');
  }
}
