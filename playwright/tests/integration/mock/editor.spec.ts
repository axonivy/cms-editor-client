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
  await expect(editor.detail).toBeVisible();
  await editor.mainToolbar.detailToggle.click();
  await expect(editor.detail).toBeHidden();
  await editor.mainToolbar.detailToggle.click();
  await expect(editor.detail).toBeVisible();
});
