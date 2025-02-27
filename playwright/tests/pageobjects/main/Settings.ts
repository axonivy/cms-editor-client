import type { Locator, Page } from '@playwright/test';
import { Button } from './Button';
import { Switch } from './Switch';

export class Settings {
  readonly button: Button;
  readonly theme: Switch;

  constructor(page: Page, parent: Locator) {
    this.button = new Button(parent, { name: 'Settings' });
    this.theme = new Switch(page, { name: 'Theme' });
  }
}
