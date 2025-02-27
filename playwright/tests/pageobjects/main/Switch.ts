import type { Locator, Page } from '@playwright/test';

export class Switch {
  readonly locator: Locator;

  constructor(page: Page, options?: { name?: string }) {
    if (options?.name) {
      this.locator = page.getByRole('switch', { name: options.name });
    } else {
      this.locator = page.getByRole('switch').first();
    }
  }
}
