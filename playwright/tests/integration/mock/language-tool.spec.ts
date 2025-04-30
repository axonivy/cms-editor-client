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

test('default language options', async () => {
  await editor.main.control.languageTool.trigger.click();
  await editor.main.control.languageTool.defaultLanguage.expectToHaveOptions('English', 'German');
});

describe('languages', () => {
  test('add language', async () => {
    const languageTool = editor.main.control.languageTool;

    await editor.main.table.row(0).locator.click();
    await languageTool.trigger.click();
    await languageTool.languages.expectToHaveRows([['English']], [['German']]);

    await languageTool.add.trigger.click();
    await languageTool.add.languages.row(1).locator.click();
    await languageTool.add.add.click();

    await languageTool.languages.expectToHaveRows([['English']], [['French']], [['German']]);
    await languageTool.save.click();

    await expect(editor.detail.value('French').locator).toBeVisible();
  });

  test('remove language', async () => {
    const languageTool = editor.main.control.languageTool;

    await editor.main.table.row(0).locator.click();
    await languageTool.trigger.click();
    await languageTool.languages.expectToHaveRows([['English']], [['German']]);

    await languageTool.languages.row(0).locator.click();
    await languageTool.delete.click();
    await languageTool.languages.expectToHaveRows([['German']]);
    await languageTool.languages.row(0).expectToBeSelected();
    await languageTool.save.click();

    await expect(editor.main.table.row(0).column(1).locator).toHaveText('');
    await expect(editor.detail.value('English').locator).toBeHidden();
  });

  test('keyboard support', async () => {
    const languageTool = editor.main.control.languageTool;
    const keyboard = editor.page.keyboard;

    await languageTool.trigger.click();
    await languageTool.languages.expectToHaveRows([['English']], [['German']]);

    await keyboard.press('Tab');
    await keyboard.press('Tab');
    await keyboard.press('ArrowDown');
    await keyboard.press('ArrowUp');
    await languageTool.languages.row(1).expectToBeSelected();
    await keyboard.press('Delete');
    await languageTool.languages.expectToHaveRows([['English']]);
    await languageTool.languages.row(0).expectToBeSelected();
  });

  describe('language browser', () => {
    const subRows = (languageTags: Array<string>, displayName: Intl.DisplayNames) =>
      languageTags
        .map(languageTag => [[displayName.of(languageTag) as string, languageTag]])
        .sort((row1: Array<Array<string>>, row2: Array<Array<string>>) => row1[0][0].localeCompare(row2[0][0]));

    test('options', async () => {
      const languageTool = editor.main.control.languageTool;
      await languageTool.trigger.click();

      const languageBrowser = languageTool.add;
      await languageBrowser.trigger.click();
      await languageBrowser.languages.row(2).expandCollapseButton.click();
      await languageBrowser.languages.row(0).expandCollapseButton.click();

      const displayName = new Intl.DisplayNames(['en'], { type: 'language' });
      await languageBrowser.languages.expectToHaveRows(
        [[displayName.of('en') as string, 'en']],
        ...subRows(['en-US', 'en-GB'], displayName),
        [[displayName.of('fr') as string, 'fr']],
        [[displayName.of('de') as string, 'de']],
        ...subRows(['de-AT', 'de-DE', 'de-CH'], displayName)
      );

      await languageBrowser.languages.expectRowsToBeSelectable(false, true, true, true, false, true, true, true);
    });

    test('initialize browser', async () => {
      const languageTool = editor.main.control.languageTool;
      await languageTool.trigger.click();

      const languageBrowser = languageTool.add;
      await languageBrowser.trigger.click();
      await expect(languageBrowser.search.locator).toBeEmpty();
      await languageBrowser.languages.expectToHaveNoSelection();
      await languageBrowser.languages.expectToHaveNoExpansion();

      await languageBrowser.search.locator.fill('e');
      await languageBrowser.languages.row(1).locator.click();
      await languageBrowser.languages.row(0).expandCollapseButton.click();
      await editor.page.keyboard.press('Escape');
      await languageBrowser.trigger.click();
      await expect(languageBrowser.search.locator).toBeEmpty();
      await languageBrowser.languages.expectToHaveNoSelection();
      await languageBrowser.languages.expectToHaveNoExpansion();
    });

    test('info', async () => {
      const languageTool = editor.main.control.languageTool;
      await languageTool.trigger.click();

      const languageBrowser = languageTool.add;
      await languageBrowser.trigger.click();
      await languageBrowser.languages.row(1).locator.click();
      await languageBrowser.info.trigger.click();
      await expect(languageBrowser.info.content).toHaveText('French (fr)');
    });
  });
});

test('initialize dialog', async () => {
  const languageTool = editor.main.control.languageTool;

  await languageTool.trigger.click();
  await languageTool.defaultLanguage.select('German');
  await languageTool.add.trigger.click();
  await languageTool.add.languages.row(1).locator.click();
  await languageTool.add.add.click();
  await languageTool.languages.row(0).locator.click();
  await languageTool.delete.click();
  await languageTool.languages.expectToHaveRows([['French']], [['German']]);
  await editor.page.keyboard.press('Escape');

  await languageTool.trigger.click();
  await expect(languageTool.defaultLanguage.locator).toHaveText('English');
  await languageTool.languages.expectToHaveRows([['English']], [['German']]);
  await languageTool.languages.expectToHaveNoSelection();
});
