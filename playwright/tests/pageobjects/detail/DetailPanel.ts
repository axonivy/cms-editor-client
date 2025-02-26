import { type Locator, type Page } from '@playwright/test';

export class DetailPanel {
  readonly locator: Locator;
  readonly fields: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-detail-panel');
    this.fields = this.locator.getByRole('textbox');
  }

  field(label: string) {
    return this.locator.getByRole('textbox', { name: label, exact: true });
  }
}
