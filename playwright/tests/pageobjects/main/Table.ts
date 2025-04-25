import { expect, type Locator } from '@playwright/test';

export class Table {
  readonly locator: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('table');
    this.headers = this.locator.locator('th');
    this.rows = this.locator.locator('tbody').getByRole('row');
  }

  header(index: number) {
    return new Header(this.headers, index);
  }

  row(index: number) {
    return new Row(this.rows, index);
  }

  async expectToHaveNoSelection() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await this.row(i).expectToBeUnselected();
    }
  }

  async expectToHaveRows(...rows: Array<Array<string>>) {
    for (let i = 0; i < rows.length; i++) {
      const row = this.row(i);
      await row.expectToHaveValues(...rows[i]);
    }
  }
}

export class Header {
  readonly locator: Locator;
  readonly content: Locator;

  constructor(headers: Locator, index: number) {
    this.locator = headers.nth(index);
    this.content = this.locator.locator('span');
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

  async expectToHaveValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      const column = this.column(i);
      await expect(column.content).toHaveText(values[i]);
    }
  }
}

export class Cell {
  readonly locator: Locator;
  readonly content: Locator;

  constructor(row: Locator, index: number) {
    this.locator = row.getByRole('cell').nth(index);
    this.content = this.locator.locator('span');
  }
}
