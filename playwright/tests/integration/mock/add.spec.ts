import test, { expect } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('add', async () => {
  await editor.main.add.add('TestContentObject', '/A/TestNamespace', 'TestValue');
  await editor.main.table.row(0).expectToBeSelected();
  await editor.main.table.row(0).expectToHaveValues('/A/TestNamespace/TestContentObject', 'TestValue');
  await editor.detail.expectToHaveValues('/A/TestNamespace/TestContentObject', { English: 'TestValue', German: '' });
});

test('default values', async () => {
  await editor.main.table.row(0).locator.click();
  await editor.main.add.trigger.locator.click();
  await expect(editor.main.add.name.locator).toHaveValue('NewContentObject');
  await expect(editor.main.add.namespace.locator).toHaveValue('/Dialogs/agileBPM/define_WF');
  await expect(editor.main.add.defaultLocaleTextbox.locator).toHaveValue('');
});

test('show field for value of client locale if it is present in the cms', async () => {
  editor.page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'ja');
  });
  await editor.page.reload();
  await editor.main.add.trigger.locator.click();
  await expect(editor.main.add.defaultLocaleLabel).toBeHidden();

  editor.page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'en');
  });
  await editor.page.reload();
  await editor.main.add.trigger.locator.click();
  await expect(editor.main.add.defaultLocaleLabel).toHaveText('English');

  editor.page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'de');
  });
  await editor.page.reload();
  await editor.main.add.trigger.locator.click();
  await expect(editor.main.add.defaultLocaleLabel).toHaveText('Deutsch');
});

test('keyboard support', async () => {
  const add = editor.main.add;
  const keyboard = editor.page.keyboard;

  await expect(add.locator).toBeHidden();
  await keyboard.press('a');
  await expect(add.locator).toBeVisible();
  await keyboard.press('Escape');
  await expect(add.locator).toBeHidden();

  await add.trigger.locator.click();
  await expect(add.locator).toBeVisible();
  await add.namespace.locator.fill('/A');
  await keyboard.press('ControlOrMeta+Enter');
  await expect(add.locator).toBeVisible();
  await add.name.locator.fill('TestContentObject');
  await keyboard.press('Enter');
  await expect(add.locator).toBeHidden();
  await expect(editor.main.table.row(0).column(0).content).toHaveText('/A/NewContentObject');
  await expect(editor.main.table.row(1).column(0).content).toHaveText('/A/TestContentObject');
});
