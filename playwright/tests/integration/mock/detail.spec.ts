import test, { expect } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

let editor: CmsEditor;

test.beforeEach(async ({ page }) => {
  editor = await CmsEditor.openMock(page);
});

test('empty while no selecton', async () => {
  await expect(editor.detail.values).toHaveCount(0);
  await expect(editor.detail.message).toHaveText('Select a Content Object to edit its values.');
});

test('uri', async () => {
  const uri = editor.detail.uri;
  await editor.main.table.row(0).locator.click();
  await expect(uri.locator).toBeDisabled();
  await expect(uri.locator).toHaveValue('/Dialogs/agileBPM/define_WF/AddTask');
  await editor.main.table.row(1).locator.click();
  await expect(uri.locator).toBeDisabled();
  await expect(uri.locator).toHaveValue('/Dialogs/agileBPM/define_WF/AdhocWorkflowTasks');
});

test('a field for each locale', async () => {
  await editor.main.table.row(2).locator.click();
  await expect(editor.detail.values).toHaveCount(2);
  await expect(editor.detail.value('English').textbox.locator).toHaveValue('Case');
  await expect(editor.detail.value('German').textbox.locator).toHaveValue('Fall');
});
