import { test } from '@playwright/test';
import { CmsEditor } from '../pageobjects/CmsEditor';

test.describe('CmsEditor', () => {
  let editor: CmsEditor;

  test.beforeEach(async ({ page }) => {
    editor = await CmsEditor.openMock(page);
  });

  test('screenshot', async () => {
    await editor.takeScreenshot('cms-editor.png');
  });
});
