import { type Locator, type Page } from '@playwright/test';
import { TextBox } from './TextBox';

export class DetailPanel {
  readonly locator: Locator;
  readonly fields: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-detail-panel');
    this.fields = this.locator.getByRole('textbox');
  }

  field(name: string) {
    return new TextBox(this.locator, { name });
  }
}
