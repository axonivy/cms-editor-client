import { expect, test } from '@playwright/test';
import { CmsEditor } from '../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openCms(page);
});

test('load data', async () => {
  await expect(editor.main.table.row(0).column(0).locator).toHaveText('/content');
});
