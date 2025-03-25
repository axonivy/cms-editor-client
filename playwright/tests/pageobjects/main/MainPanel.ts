import type { Locator, Page } from '@playwright/test';
import { AddContentObject } from './AddContentObject';
import { MainToolbar } from './MainToolbar';
import { Table } from './Table';

export class MainPanel {
  readonly locator: Locator;
  readonly toolbar: MainToolbar;
  readonly label: Locator;
  readonly add: AddContentObject;
  readonly search: Locator;
  readonly table: Table;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-main-panel');
    this.toolbar = new MainToolbar(page, this.locator);
    this.label = this.locator.locator('.cms-editor-main-table-field').locator('label');
    this.add = new AddContentObject(page, this.locator);
    this.search = this.locator.getByRole('textbox').first();
    this.table = new Table(this.locator);
  }
}
