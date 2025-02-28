import type { Locator } from '@playwright/test';

export class TextBox {
  readonly locator: Locator;

  constructor(parent: Locator, options?: { name?: string }) {
    if (options?.name) {
      this.locator = parent.getByRole('textbox', { name: options.name, exact: true });
    } else {
      this.locator = parent.getByRole('textbox').first();
    }
  }
}
