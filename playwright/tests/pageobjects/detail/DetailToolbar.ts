import type { Locator } from '@playwright/test';
import { Button } from '../main/Button';

export class DetailToolbar {
  readonly locator: Locator;
  readonly help: Button;

  constructor(parent: Locator) {
    this.locator = parent.locator('.cms-editor-detail-toolbar');
    this.help = new Button(this.locator, { name: 'Open Help (F1)' });
  }
}
