import type { Locator } from '@playwright/test';

export class DetailToolbar {
  readonly locator: Locator;
  readonly help: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('.cms-editor-detail-toolbar');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
  }
}
