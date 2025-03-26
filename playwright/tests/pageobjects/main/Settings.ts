import type { Locator, Page } from '@playwright/test';

export class Settings {
  readonly button: Locator;
  readonly theme: Locator;

  constructor(page: Page, parent: Locator) {
    this.button = parent.getByRole('button', { name: 'Settings' });
    this.theme = page.getByRole('switch', { name: 'Theme' });
  }
}
