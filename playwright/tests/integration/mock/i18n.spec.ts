import { expect, test } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('translation', async () => {
  await expect(editor.main.label).toHaveText('Content Objects');
  await expect(editor.main.table.header(1).content).toHaveText('English');
  await expect(editor.detail.message).toHaveText('Select a Content Object to edit its values.');
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.textbox('German')).toBeVisible();

  editor.page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'de');
  });
  await editor.page.reload();
  await expect(editor.main.label).toHaveText('Inhaltsobjekte');
  await expect(editor.main.table.header(1).content).toHaveText('Deutsch');
  await expect(editor.detail.message).toHaveText('Wähle ein Inhaltsobjekt aus um es zu bearbeiten.');
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.textbox('Deutsch')).toBeVisible();
});
