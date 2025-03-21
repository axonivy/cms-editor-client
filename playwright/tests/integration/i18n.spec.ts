import { expect, test } from '@playwright/test';
import { CmsEditor } from '../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openCms(page);
});

test('english translation', async () => {
  await expect(editor.detail.locator.getByText('Select a Content Object to edit its values.')).toBeVisible();
  await expect(editor.main.locator.getByText('Content Objects')).toBeVisible();
});

test('german translation', async ({ page }) => {
  page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'de');
  });
  await page.reload();
  await expect(editor.detail.locator.getByText('Wähle ein Inhaltsobjekt aus um es zu bearbeiten.')).toBeVisible();
  await expect(editor.main.locator.getByText('Inhaltsobjekte')).toBeVisible();
});
