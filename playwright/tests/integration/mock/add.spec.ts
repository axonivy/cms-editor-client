import test, { expect } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('add', async () => {
  await editor.main.control.add.add('TestContentObject', '/A/TestNamespace', 'TestValue');
  await editor.main.table.row(0).expectToBeSelected();
  await editor.main.table.row(0).expectToHaveValues('/A/TestNamespace/TestContentObject', 'TestValue');
  await editor.detail.expectToHaveValues('/A/TestNamespace/TestContentObject', { English: 'TestValue', German: '' });
});

test('default values', async () => {
  await editor.main.table.row(0).locator.click();
  await editor.main.control.add.trigger.click();
  await expect(editor.main.control.add.name.locator).toHaveValue('NewContentObject');
  await expect(editor.main.control.add.namespace.locator).toHaveValue('/Dialogs/agileBPM/define_WF');
  await editor.main.control.add.namespace.expectToHaveOptions(
    '/Dialogs/agileBPM/define_WF',
    '/Dialogs/agileBPM/task_Form',
    '/Dialogs/general',
    '/Dialogs/procurementRequest',
    '/Dialogs/signal',
    '/Dialogs/trigger'
  );
  await expect(editor.main.control.add.value.textbox.locator).toHaveValue('');
});

test('show field for value of default language', async ({ page }) => {
  editor = await CmsEditor.openMock(page, { lng: 'ja' });
  await editor.page.keyboard.press('a');
  await expect(editor.main.control.add.value.label).toHaveText('英語');

  editor = await CmsEditor.openMock(page, { lng: 'en' });
  await editor.page.keyboard.press('a');
  await expect(editor.main.control.add.value.label).toHaveText('English');

  editor = await CmsEditor.openMock(page, { lng: 'de' });
  await editor.page.keyboard.press('a');
  await expect(editor.main.control.add.value.label).toHaveText('Deutsch');
});

test('keyboard support', async () => {
  const add = editor.main.control.add;
  const keyboard = editor.page.keyboard;

  await expect(add.locator).toBeHidden();
  await keyboard.press('a');
  await expect(add.locator).toBeVisible();
  await keyboard.press('Escape');
  await expect(add.locator).toBeHidden();

  await add.trigger.click();
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

test('disable dialog while create request is pending', async () => {
  const add = editor.main.control.add;
  await add.trigger.click();
  await add.name.locator.fill('IsPending');
  await add.create.click();
  await expect(add.name.locator).toBeDisabled();
  await expect(add.namespace.locator).toBeDisabled();
  await expect(add.value.delete).toBeDisabled();
  await expect(add.value.textbox.locator).toBeDisabled();
  await expect(add.create).toBeDisabled();
  await editor.page.keyboard.press('Escape');
  await expect(add.locator).toBeVisible();
  await expect(add.locator).toBeHidden();
});

test('show error if create request is error', async () => {
  const add = editor.main.control.add;
  await expect(add.error.locator).toBeHidden();
  await add.trigger.click();
  await add.name.locator.fill('IsError');
  await add.create.click();
  await expect(add.locator).toBeVisible();
  await add.error.expectToBeError('An error has occurred: Error: error message');
});

test('validation', async () => {
  const add = editor.main.control.add;
  await add.trigger.click();
  const nameMessage = await add.name.message();
  const namespaceMessage = await add.namespace.message();
  const valueMessage = await add.value.textbox.message();

  await namespaceMessage.expectToBeInfo("Folder structure of Content Object (e.g. '/Dialog/Label').");
  await expect(add.create).toBeEnabled();

  await add.name.locator.clear();
  await nameMessage.expectToBeError('Name cannot be empty.');
  await expect(add.create).toBeDisabled();
  await editor.page.keyboard.press('Enter');
  await expect(add.locator).toBeVisible();

  await add.name.locator.fill('name');
  await add.value.delete.click();
  await valueMessage.expectToBeError('Value cannot be empty.');
  await expect(add.create).toBeDisabled();
  await editor.page.keyboard.press('Enter');
  await expect(add.locator).toBeVisible();

  await add.value.textbox.locator.fill('value');
  await expect(add.create).toBeEnabled();
});
