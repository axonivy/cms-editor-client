import type { Locator, Page } from '@playwright/test';
import { TextBox } from '../TextBox';
import { Button } from './Button';

export class AddContentObject {
  readonly locator: Locator;
  readonly trigger: Button;
  readonly name: TextBox;
  readonly namespace: TextBox;
  readonly defaultLocaleLabel: Locator;
  readonly defaultLocaleTextbox: TextBox;
  readonly create: Button;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog');
    this.trigger = new Button(parent.locator('.cms-editor-main-control'));
    this.name = new TextBox(this.locator, { name: 'Name' });
    this.namespace = new TextBox(this.locator, { name: 'Namespace' });
    this.defaultLocaleLabel = this.locator.locator('.cms-editor-add-dialog-default-locale').locator('label');
    this.defaultLocaleTextbox = new TextBox(this.locator.locator('.cms-editor-add-dialog-default-locale'));
    this.create = new Button(this.locator, { name: 'Create Content Object' });
  }

  async add(name: string, namespace: string, value: string) {
    await this.trigger.locator.click();
    await this.name.locator.fill(name);
    await this.namespace.locator.fill(namespace);
    await this.defaultLocaleTextbox.locator.fill(value);
    await this.create.locator.click();
  }
}
