import { expect, test } from '@playwright/test';
import { CmsEditor } from '../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openCms(page);
});

test('load data', async () => {
  await expect(editor.page.locator('.cms-editor-content')).toHaveText('[{"uri":"/content","values":{"en":"object"}}]');
});
