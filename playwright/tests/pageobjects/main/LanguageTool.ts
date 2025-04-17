import type { Locator, Page } from '@playwright/test';
import { Select } from '../abstract/Select';

export class LanguageTool {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly defaultLanguage: Select;
  readonly save: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog');
    this.trigger = parent.getByRole('button', { name: 'Language Tool' });
    this.defaultLanguage = new Select(page, this.locator, { name: 'Default Language' });
    this.save = this.locator.getByRole('button', { name: 'Save' });
  }
}
