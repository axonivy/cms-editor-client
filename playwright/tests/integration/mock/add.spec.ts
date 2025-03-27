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
  await editor.main.add.trigger.click();
  await expect(editor.main.add.name).toHaveValue('NewContentObject');
  await expect(editor.main.add.namespace).toHaveValue('/Dialogs/agileBPM/define_WF');
  await expect(editor.main.add.defaultLocaleTextbox).toHaveValue('');
});

test('show field for value of default language', async ({ page }) => {
  editor = await CmsEditor.openMock(page, { lng: 'ja' });
  await editor.main.add.trigger.click();
  await expect(editor.main.add.defaultLocaleLabel).toHaveText('英語');

  editor = await CmsEditor.openMock(page, { lng: 'en' });
  await editor.main.add.trigger.click();
  await expect(editor.main.add.defaultLocaleLabel).toHaveText('English');

  editor = await CmsEditor.openMock(page, { lng: 'de' });
  await editor.main.add.trigger.click();
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

  await add.trigger.click();
  await expect(add.locator).toBeVisible();
  await add.namespace.fill('/A');
  await keyboard.press('ControlOrMeta+Enter');
  await expect(add.locator).toBeVisible();
  await add.name.fill('TestContentObject');
  await keyboard.press('Enter');
  await expect(add.locator).toBeHidden();
  await expect(editor.main.table.row(0).column(0).content).toHaveText('/A/NewContentObject');
  await expect(editor.main.table.row(1).column(0).content).toHaveText('/A/TestContentObject');
});

test('disable dialog while create request is pending', async () => {
  const add = editor.main.add;
  await add.trigger.click();
  await add.name.fill('IsPending');
  await add.create.click();
  await expect(add.name).toBeDisabled();
  await expect(add.namespace).toBeDisabled();
  await expect(add.defaultLocaleTextbox).toBeDisabled();
  await expect(add.create).toBeDisabled();
  await editor.page.keyboard.press('Escape');
  await expect(add.locator).toBeVisible();
  await expect(add.locator).toBeHidden();
});

test('show error if create request is error', async () => {
  const add = editor.main.add;
  await expect(add.error).toBeHidden();
  await add.trigger.click();
  await add.name.fill('IsError');
  await add.create.click();
  await expect(add.locator).toBeVisible();
  await expect(add.error).toHaveText('An error has occurred: Error: error message');
});
