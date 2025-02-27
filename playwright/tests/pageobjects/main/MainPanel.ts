import type { Locator, Page } from '@playwright/test';
import { MainToolbar } from './MainToolbar';
import { Table } from './Table';

export class MainPanel {
  readonly locator: Locator;
  readonly toolbar: MainToolbar;
  readonly table: Table;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-main-panel');
    this.toolbar = new MainToolbar(page, this.locator);
    this.table = new Table(this.locator);
  }
}
