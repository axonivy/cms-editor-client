import { expect, test } from '@playwright/test';
import { CmsEditor } from '../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openCms(page);
});

test('load data', async () => {
  await expect(editor.main.table.rows).toHaveCount(3);

  await editor.main.table.row(0).locator.click();
  await expect(editor.main.table.row(0).column(0).locator).toHaveText('/folder');
  await expect(editor.detail.field('German').locator).toHaveValue('ordner');
  await expect(editor.detail.field('English').locator).toHaveValue('folder');

  await editor.main.table.row(1).locator.click();
  await expect(editor.main.table.row(1).column(0).locator).toHaveText('/folder/stringOne');
  await expect(editor.detail.field('German').locator).toHaveValue('wertEins');
  await expect(editor.detail.field('English').locator).toHaveValue('valueOne');

  await editor.main.table.row(2).locator.click();
  await expect(editor.main.table.row(2).column(0).locator).toHaveText('/folder/stringTwo');
  await expect(editor.detail.field('German').locator).toHaveValue('');
  await expect(editor.detail.field('English').locator).toHaveValue('valueTwo');
});
