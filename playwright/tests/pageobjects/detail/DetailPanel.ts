import { expect, type Locator, type Page } from '@playwright/test';
import { DetailToolbar } from './DetailToolbar';

export class DetailPanel {
  readonly locator: Locator;
  readonly toolbar: DetailToolbar;
  readonly uri: Locator;
  readonly locales: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.cms-editor-detail-panel');
    this.toolbar = new DetailToolbar(this.locator);
    this.uri = this.locator.getByRole('textbox', { name: 'URI' });
    this.locales = this.locator.locator('.cms-editor-locale-fields').getByRole('textbox');
    this.message = this.locator.locator('p');
  }

  textbox(name: string) {
    return this.locator.getByRole('textbox', { name });
  }

  async expectToHaveValues(uri: string, values: Record<string, string>) {
    await expect(this.uri).toHaveValue(uri);
    for (const [language, value] of Object.entries(values)) {
      await expect(this.textbox(language)).toHaveValue(value);
    }
  }
}
