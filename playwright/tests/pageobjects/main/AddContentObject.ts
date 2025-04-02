import { expect, type Locator, type Page } from '@playwright/test';
import { Combobox } from '../abstract/Combobox';
import { Message } from '../abstract/Message';
import { Textbox } from '../abstract/Textbox';
import { CmsValueField } from '../components/CmsValueField';

export class AddContentObject {
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly name: Textbox;
  readonly namespace: Combobox;
  readonly value: CmsValueField;
  readonly error: Message;
  readonly create: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog');
    this.trigger = parent.getByRole('button').first();
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.namespace = new Combobox(this.locator, { name: 'Namespace' });
    this.value = new CmsValueField(page, this.locator);
    this.error = new Message(this.locator, { className: 'cms-editor-add-dialog-error-message' });
    this.create = this.locator.getByRole('button', { name: 'Create Content Object' });
  }

  async add(name: string, namespace: string, value: string) {
    await this.trigger.click();
    await expect(this.locator).toBeVisible();
    await this.name.locator.fill(name);
    await this.namespace.locator.fill(namespace);
    await this.value.textbox.locator.fill(value);
    await this.create.click();
    await expect(this.locator).toBeHidden();
  }
}
