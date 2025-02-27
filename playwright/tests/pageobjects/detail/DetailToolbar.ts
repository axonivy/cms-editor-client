import type { Locator } from '@playwright/test';

export class DetailToolbar {
  readonly locator: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('.cms-editor-detail-toolbar');
  }
}
