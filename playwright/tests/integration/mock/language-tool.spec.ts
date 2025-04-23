import test, { expect } from '@playwright/test';
import { describe } from 'node:test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('default language', async () => {
  const languageTool = editor.main.control.languageTool;

  await expect(editor.main.table.header(1).content).toHaveText('English');
  await languageTool.trigger.click();
  await expect(languageTool.defaultLanguage.locator).toHaveText('English');

  await languageTool.defaultLanguage.select('German');
  await languageTool.save.click();
  await expect(editor.main.table.header(1).content).toHaveText('German');
});

test('open and save using keyboard', async () => {
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
  await editor.main.control.languageTool.defaultLanguage.expectToHaveOptions('English', 'German');
});

describe('languages', () => {
  test('remove language', async () => {
    const languageTool = editor.main.control.languageTool;

    await editor.main.table.row(0).locator.click();
    await languageTool.trigger.click();
    await languageTool.languages.expectToHaveRows(['English'], ['German']);

    await languageTool.languages.row(0).locator.click();
    await languageTool.deleteLanguage.click();
    await languageTool.languages.expectToHaveRows(['German']);
    await languageTool.languages.row(0).expectToBeSelected();
    await languageTool.save.click();

    await expect(editor.main.table.row(0).column(1).locator).toHaveText('');
    await expect(editor.detail.value('English').locator).toBeHidden();
  });

  test('keyboard support', async () => {
    const languageTool = editor.main.control.languageTool;
    const keyboard = editor.page.keyboard;

    await languageTool.trigger.click();
    await languageTool.languages.expectToHaveRows(['English'], ['German']);

    await keyboard.press('Tab');
    await keyboard.press('ArrowDown');
    await keyboard.press('ArrowUp');
    await languageTool.languages.row(1).expectToBeSelected();
    await keyboard.press('Delete');
    await languageTool.languages.expectToHaveRows(['English']);
    await languageTool.languages.row(0).expectToBeSelected();
  });
});

test('initialize dialog', async () => {
  const languageTool = editor.main.control.languageTool;

  await languageTool.trigger.click();
  await languageTool.defaultLanguage.select('German');
  await languageTool.languages.row(0).locator.click();
  await languageTool.deleteLanguage.click();
  await editor.page.keyboard.press('Escape');

  await languageTool.trigger.click();
  await expect(languageTool.defaultLanguage.locator).toHaveText('English');
  await languageTool.languages.expectToHaveRows(['English'], ['German']);
  await languageTool.languages.expectToHaveNoSelection();
});
