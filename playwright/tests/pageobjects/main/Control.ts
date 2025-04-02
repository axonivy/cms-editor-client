import type { Locator, Page } from '@playwright/test';
import { AddContentObject } from './AddContentObject';

export class Control {
  readonly locator: Locator;
  readonly add: AddContentObject;
  readonly delete: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.cms-editor-main-control');
    this.add = new AddContentObject(page, this.locator);
    this.delete = this.locator.getByRole('button', { name: 'Delete Content Object' });
  }
}
