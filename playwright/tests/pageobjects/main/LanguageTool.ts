import { expect, type Locator, type Page } from '@playwright/test';
import { AddLanguage } from './AddLanguage';
import { Table } from './Table';

export class LanguageTool {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly add: AddLanguage;
  readonly delete: Locator;
  readonly languages: Table;
  readonly save: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog');
    this.trigger = parent.getByRole('button', { name: 'Language Tool' });
    this.add = new AddLanguage(page, this.locator);
    this.delete = this.locator.getByRole('button', { name: 'Delete Language' });
    this.languages = new Table(this.locator);
    this.save = this.locator.getByRole('button', { name: 'Save' });
  }

  async expectToHaveLanguages(...languages: Array<string>) {
    await expect(this.languages.rows).toHaveCount(languages.length);
    for (let i = 0; i < languages.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await expect(this.languages.row(i).locator).toHaveText(languages[i]!);
    }
  }

  checkboxOfRow(index: number) {
    return this.languages.row(index).locator.getByRole('checkbox');
  }
}
