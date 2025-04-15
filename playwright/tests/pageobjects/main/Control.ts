import type { Locator, Page } from '@playwright/test';
import { AddContentObject } from './AddContentObject';
import { LanguageTool } from './LanguageTool';

export class Control {
  readonly locator: Locator;
  readonly languageTool: LanguageTool;
  readonly add: AddContentObject;
  readonly delete: Locator;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.cms-editor-main-control');
    this.add = new AddContentObject(page, this.locator);
    this.languageTool = new LanguageTool(page, this.locator);
    this.delete = this.locator.getByRole('button', { name: 'Delete Content Object' });
  }
}
