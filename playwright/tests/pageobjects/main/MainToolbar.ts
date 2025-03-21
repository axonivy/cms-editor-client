import type { Locator, Page } from '@playwright/test';
import { Button } from './Button';
import { Settings } from './Settings';

export class MainToolbar {
  readonly locator: Locator;
  readonly title: Locator;
  readonly settings: Settings;
  readonly detailToggle: Button;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.cms-editor-main-toolbar');
    this.title = this.locator.locator('.cms-editor-main-toolbar-title');
    this.settings = new Settings(page, this.locator);
    this.detailToggle = new Button(this.locator, { name: 'Details' });
  }
}
