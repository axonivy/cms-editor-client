import test, { expect } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('search', async () => {
  await editor.main.search.locator.fill('hello');
  await expect(editor.main.table.rows).toHaveCount(0);
  await editor.main.search.locator.fill('tasks');
  await expect(editor.main.table.rows).toHaveCount(3);
});

test.describe('table keyboard support', () => {
  test('move selection via arrowKey', async () => {
    await editor.main.table.expectToHaveNoSelection();
    await editor.main.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.main.table.row(1).expectToBeSelected();
  });

  test('toggle detail via enter', async () => {
    await editor.main.table.row(0).locator.click();
    await expect(editor.detail.locator).toBeVisible();
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).toBeHidden();
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).toBeVisible();
  });
});

test('show column for client locale if it is present in the cms', async () => {
  editor.page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'ja');
  });
  await editor.page.reload();
  await expect(editor.main.table.headers).toHaveCount(1);
  await expect(editor.main.table.header(0).content).toHaveText('URI');

  editor.page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'en');
  });
  await editor.page.reload();
  await expect(editor.main.table.headers).toHaveCount(2);
  await expect(editor.main.table.header(0).content).toHaveText('URI');
  await expect(editor.main.table.header(1).content).toHaveText('English');
  await expect(editor.main.table.row(2).column(1).content).toHaveText('Case');

  editor.page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'de');
  });
  await editor.page.reload();
  await expect(editor.main.table.headers).toHaveCount(2);
  await expect(editor.main.table.header(0).content).toHaveText('URI');
  await expect(editor.main.table.header(1).content).toHaveText('Deutsch');
  await expect(editor.main.table.row(2).column(1).content).toHaveText('Fall');
});
