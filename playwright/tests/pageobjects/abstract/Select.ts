import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Select {
  readonly locator: Locator;
  readonly options: Locator;

  constructor(page: Page, parent: Locator, options?: { name?: string }) {
    if (options?.name) {
      this.locator = parent.getByRole('combobox', { name: options.name, exact: true });
    } else {
      this.locator = parent.getByRole('combobox').first();
    }
    this.options = page.getByRole('option');
  }

  async select(option: string) {
    await this.locator.click();
    await this.options.getByText(option, { exact: true }).click();
  }

  async expectToHaveOptions(...options: Array<string>) {
    await this.locator.click();
    await expect(this.options).toHaveCount(options.length);
    for (let i = 0; i < options.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await expect(this.options.nth(i)).toHaveText(options[i]!);
    }
  }
}
