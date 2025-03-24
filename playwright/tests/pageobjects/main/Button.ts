import type { Locator } from '@playwright/test';

export class Button {
  readonly locator: Locator;

  constructor(parent: Locator, options?: { name?: string }) {
    if (options?.name) {
      this.locator = parent.getByRole('button', { name: options.name });
    } else {
      this.locator = parent.getByRole('button').first();
    }
  }
}
