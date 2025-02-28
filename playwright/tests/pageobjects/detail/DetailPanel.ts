import { type Locator, type Page } from '@playwright/test';
import { DetailToolbar } from './DetailToolbar';
import { TextBox } from '../TextBox';

export class DetailPanel {
  readonly locator: Locator;
  readonly toolbar: DetailToolbar;
  readonly uri: TextBox;
  readonly locales: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-detail-panel');
    this.toolbar = new DetailToolbar(this.locator);
    this.uri = new TextBox(this.locator, { name: 'URI' });
    this.locales = this.locator.getByRole('textbox', { disabled: false });
  }

  field(name: string) {
    return new TextBox(this.locator, { name });
  }
}
