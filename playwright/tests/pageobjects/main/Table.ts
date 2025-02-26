import { expect, type Locator } from '@playwright/test';

export class Table {
  readonly locator: Locator;
  readonly rows: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('table');
    this.rows = this.locator.locator('tbody tr');
  }

  row(index: number) {
    return new Row(this.rows, index);
  }

  async expectToHaveNoSelection() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await this.row(i).expectToBeUnselected();
    }
  }
}

export class Row {
  readonly locator: Locator;

  constructor(rows: Locator, index: number) {
    this.locator = rows.nth(index);
  }

  column(index: number) {
    return new Cell(this.locator, index);
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }

  async expectToBeUnselected() {
    await expect(this.locator).toHaveAttribute('data-state', 'unselected');
  }
}

export class Cell {
  readonly locator: Locator;
  readonly content: Locator;

  constructor(row: Locator, index: number) {
    this.locator = row.locator('td').nth(index);
    this.content = this.locator.locator('span');
  }
}
