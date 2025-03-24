import { expect, test } from '@playwright/test';
import { CmsEditor } from '../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openCms(page);
});

test('load data', async () => {
  await expect(editor.main.table.rows).toHaveCount(2);

  await editor.main.table.row(0).locator.click();
  await editor.main.table.row(0).expectToHaveValues('/folder/stringOne', 'valueOne');
  await editor.detail.expectToHaveValues('/folder/stringOne', { English: 'valueOne', German: 'wertEins' });

  await editor.main.table.row(1).locator.click();
  await editor.main.table.row(1).expectToHaveValues('/folder/stringTwo', 'valueTwo');
  await editor.detail.expectToHaveValues('/folder/stringTwo', { English: 'valueTwo', German: '' });
});
