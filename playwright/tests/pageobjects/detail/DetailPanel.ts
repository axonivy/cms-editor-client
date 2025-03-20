import { type Locator, type Page } from '@playwright/test';
import { TextBox } from '../TextBox';
import { DetailToolbar } from './DetailToolbar';

export class DetailPanel {
  readonly locator: Locator;
  readonly toolbar: DetailToolbar;
  readonly uri: TextBox;
  readonly locales: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-detail-panel');
    this.toolbar = new DetailToolbar(this.locator);
    this.uri = new TextBox(this.locator, { name: 'URI' });
    this.locales = this.locator.locator('.cms-editor-locale-fields').getByRole('textbox');
    this.message = this.locator.locator('p');
  }

  field(name: string) {
    return new TextBox(this.locator, { name });
  }
}
