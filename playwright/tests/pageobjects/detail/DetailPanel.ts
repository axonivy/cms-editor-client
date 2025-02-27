import { type Locator, type Page } from '@playwright/test';
import { DetailToolbar } from './DetailToolbar';
import { TextBox } from './TextBox';

export class DetailPanel {
  readonly locator: Locator;
  readonly toolbar: DetailToolbar;
  readonly fields: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-detail-panel');
    this.toolbar = new DetailToolbar(this.locator);
    this.fields = this.locator.getByRole('textbox');
  }

  field(name: string) {
    return new TextBox(this.locator, { name });
  }
}
