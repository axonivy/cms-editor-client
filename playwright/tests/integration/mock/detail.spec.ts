import test, { expect } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('empty while no selecton', async () => {
  await expect(editor.detail.fields).toHaveCount(0);
  await expect(editor.detail.locator.locator('p')).toHaveText('Select a Content Object to edit its values.');
});

test('a field for each locale', async () => {
  await editor.main.table.row(5).locator.click();
  await expect(editor.detail.fields).toHaveCount(2);
  await expect(editor.detail.field('English')).toHaveValue('Case');
  await expect(editor.detail.field('German')).toHaveValue('Fall');
});
