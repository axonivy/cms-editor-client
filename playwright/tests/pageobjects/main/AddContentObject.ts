import { expect, type Locator, type Page } from '@playwright/test';
import { CmsValueField } from '../components/CmsValueField';

export class AddContentObject {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly name: Locator;
  readonly namespace: Locator;
  readonly value: CmsValueField;
  readonly error: Locator;
  readonly create: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog');
    this.trigger = parent.locator('.cms-editor-main-control').getByRole('button').first();
    this.name = this.locator.getByRole('textbox', { name: 'Name', exact: true });
    this.namespace = this.locator.getByRole('textbox', { name: 'Namespace' });
    this.value = new CmsValueField(page, this.locator);
    this.error = this.locator.locator('.cms-editor-add-dialog-error-message');
    this.create = this.locator.getByRole('button', { name: 'Create Content Object' });
  }

  async add(name: string, namespace: string, value: string) {
    await this.trigger.click();
    await expect(this.locator).toBeVisible();
    await this.name.fill(name);
    await this.namespace.fill(namespace);
    await this.value.textbox.fill(value);
    await this.create.click();
    await expect(this.locator).toBeHidden();
  }
}
