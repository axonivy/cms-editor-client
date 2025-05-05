import { expect, type Locator, type Page } from '@playwright/test';
import { Combobox } from '../abstract/Combobox';
import { Message } from '../abstract/Message';
import { Textbox } from '../abstract/Textbox';
import { CmsValueField } from '../components/CmsValueField';

export class AddContentObject {
  readonly page: Page;
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly name: Textbox;
  readonly namespace: Combobox;
  readonly error: Message;
  readonly create: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.trigger = parent.getByRole('button', { name: 'Add Content Object' });
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.namespace = new Combobox(this.locator, { name: 'Namespace' });
    this.error = new Message(this.locator, { className: 'cms-editor-add-dialog-error-message' });
    this.create = this.locator.getByRole('button', { name: 'Create Content Object' });
  }

  async add(name: string, namespace: string, values: Record<string, string>) {
    await this.trigger.click();
    await expect(this.locator).toBeVisible();
    await this.name.locator.fill(name);
    await this.namespace.locator.fill(namespace);
    for (const [language, value] of Object.entries(values)) {
      await this.value(language).textbox.locator.fill(value);
    }
    await this.create.click();
    await expect(this.locator).toBeHidden();
  }

  value(label: string) {
    return new CmsValueField(this.page, this.locator, { label });
  }
}
