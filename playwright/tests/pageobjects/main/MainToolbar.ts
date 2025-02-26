import type { Locator } from '@playwright/test';

export class MainToolbar {
  readonly locator: Locator;
  readonly detailToggle: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('.cms-editor-main-toolbar');
    this.detailToggle = this.locator.getByRole('button', { name: 'Details toggle' });
  }
}
