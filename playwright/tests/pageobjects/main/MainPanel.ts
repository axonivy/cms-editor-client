import type { Locator, Page } from '@playwright/test';
import { TextBox } from '../TextBox';
import { MainToolbar } from './MainToolbar';
import { Table } from './Table';

export class MainPanel {
  readonly locator: Locator;
  readonly toolbar: MainToolbar;
  readonly search: TextBox;
  readonly table: Table;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-main-panel');
    this.toolbar = new MainToolbar(page, this.locator);
    this.search = new TextBox(this.locator);
    this.table = new Table(this.locator);
  }
}
