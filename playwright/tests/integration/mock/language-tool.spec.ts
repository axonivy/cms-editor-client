import test, { expect } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('default language', async () => {
  await expect(editor.main.table.header(1).content).toHaveText('English');
  await editor.main.control.languageTool.trigger.click();
  await editor.main.control.languageTool.defaultLanguage.select('German');
  await editor.main.control.languageTool.save.click();
  await expect(editor.main.table.header(1).content).toHaveText('German');
});

test('keyboard support', async () => {
  await expect(editor.main.table.header(1).content).toHaveText('English');
  await expect(editor.main.control.languageTool.locator).toBeHidden();

  await editor.page.keyboard.press('l');
  await expect(editor.main.control.languageTool.locator).toBeVisible();

  await editor.main.control.languageTool.defaultLanguage.select('German');
  await editor.page.keyboard.press('Enter');
  await expect(editor.main.control.languageTool.locator).toBeHidden();
  await expect(editor.main.table.header(1).content).toHaveText('German');
});

test('options', async () => {
  await editor.main.control.languageTool.trigger.click();
  await editor.main.control.languageTool.defaultLanguage.expectToHaveOptions(
    'American English',
    'Austrian German',
    'British English',
    'English',
    'German',
    'German (Germany)',
    'Swiss High German'
  );
});
