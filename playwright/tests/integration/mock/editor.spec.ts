import { expect, test } from '@playwright/test';
import { CmsEditor } from '../../pageobjects/CmsEditor';

test('title', async ({ page }) => {
  await CmsEditor.openMock(page);
  await expect(page).toHaveTitle('CMS Editor Mock');
});
