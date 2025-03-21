import type { Locator, Page } from '@playwright/test';
import { TextBox } from '../TextBox';
import { MainToolbar } from './MainToolbar';
import { Table } from './Table';

export class MainPanel {
  readonly locator: Locator;
  readonly toolbar: MainToolbar;
  readonly label: Locator;
  readonly search: TextBox;
  readonly table: Table;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-main-panel');
    this.toolbar = new MainToolbar(page, this.locator);
    this.label = this.locator.locator('.cms-editor-main-table-field').locator('label');
    this.search = new TextBox(this.locator);
    this.table = new Table(this.locator);
  }
}
