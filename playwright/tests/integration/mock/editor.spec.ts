import { expect, test } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('title', async ({ page }) => {
  await expect(page).toHaveTitle('CMS Editor Mock');
});

test('toggle detail', async () => {
  await expect(editor.detail.locator).toBeVisible();
  await editor.main.toolbar.detailToggle.locator.click();
  await expect(editor.detail.locator).toBeHidden();
  await editor.main.toolbar.detailToggle.locator.click();
  await expect(editor.detail.locator).toBeVisible();
});

test('theme', async () => {
  await editor.main.toolbar.settings.button.locator.click();
  await editor.expectToBeLight();
  await editor.main.toolbar.settings.theme.locator.click();
  await editor.expectToBeDark();
  await editor.main.toolbar.settings.theme.locator.click();
  await editor.expectToBeLight();
});

test('toolbar titles', async () => {
  await expect(editor.main.toolbar.title).toHaveText('CMS - pmv-name');
  await expect(editor.detail.toolbar.locator).toHaveText('CMS - pmv-name');
  await editor.main.table.row(0).locator.click();
  await expect(editor.main.toolbar.title).toHaveText('CMS - pmv-name');
  await expect(editor.detail.toolbar.locator).toHaveText('CMS - pmv-name - /Dialogs');
});
