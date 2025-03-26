import { expect, type Locator, type Page } from '@playwright/test';

export class AddContentObject {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly name: Locator;
  readonly namespace: Locator;
  readonly defaultLocaleLabel: Locator;
  readonly defaultLocaleTextbox: Locator;
  readonly error: Locator;
  readonly create: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog');
    this.trigger = parent.locator('.cms-editor-main-control').getByRole('button').first();
    this.name = this.locator.getByRole('textbox', { name: 'Name', exact: true });
    this.namespace = this.locator.getByRole('textbox', { name: 'Namespace' });
    this.defaultLocaleLabel = this.locator.locator('.cms-editor-add-dialog-default-locale').locator('label');
    this.defaultLocaleTextbox = this.locator.locator('.cms-editor-add-dialog-default-locale').getByRole('textbox');
    this.error = this.locator.locator('.cms-editor-add-dialog-error-message');
    this.create = this.locator.getByRole('button', { name: 'Create Content Object' });
  }

  async add(name: string, namespace: string, value: string) {
    await this.trigger.click();
    await expect(this.locator).toBeVisible();
    await this.name.fill(name);
    await this.namespace.fill(namespace);
    await this.defaultLocaleTextbox.fill(value);
    await this.create.click();
    await expect(this.locator).toBeHidden();
  }
}
