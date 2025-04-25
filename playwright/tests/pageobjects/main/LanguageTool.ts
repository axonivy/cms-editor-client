import type { Locator, Page } from '@playwright/test';
import { Select } from '../abstract/Select';
import { Table } from './Table';

export class LanguageTool {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly defaultLanguage: Select;
  readonly deleteLanguage: Locator;
  readonly languages: Table;
  readonly save: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog');
    this.trigger = parent.getByRole('button', { name: 'Language Tool' });
    this.defaultLanguage = new Select(page, this.locator, { name: 'Default Language' });
    this.deleteLanguage = this.locator.getByRole('button', { name: 'Delete Language' });
    this.languages = new Table(this.locator);
    this.save = this.locator.getByRole('button', { name: 'Save' });
  }
}
