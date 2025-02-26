import type { Locator, Page } from '@playwright/test';

export class MainToolbar {
  readonly locator: Locator;
  readonly detailToggle: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-main-toolbar');
    this.detailToggle = this.locator.getByRole('button', { name: 'Details toggle' });
  }
}
