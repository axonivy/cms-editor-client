import { expect, type Locator, type Page } from '@playwright/test';
import { CmsValueField } from '../components/CmsValueField';
import { DetailToolbar } from './DetailToolbar';

export class DetailPanel {
  readonly page: Page;
  readonly locator: Locator;
  readonly toolbar: DetailToolbar;
  readonly uri: Locator;
  readonly values: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('.cms-editor-detail-panel');
    this.toolbar = new DetailToolbar(this.locator);
    this.uri = this.locator.getByRole('textbox', { name: 'URI' });
    this.values = this.locator.locator('.cms-editor-value-field');
    this.message = this.locator.locator('p');
  }

  value(label: string) {
    return new CmsValueField(this.page, this.locator, { label });
  }

  async expectToHaveValues(uri: string, values: Record<string, string>) {
    await expect(this.uri).toHaveValue(uri);
    for (const [language, value] of Object.entries(values)) {
      await expect(this.value(language).textbox).toHaveValue(value);
    }
  }
}
