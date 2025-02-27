import { expect, type Locator, type Page } from '@playwright/test';
import { DetailPanel } from './detail/DetailPanel';
import { MainPanel } from './main/MainPanel';

export const server = process.env.BASE_URL ?? 'http://localhost:8081';
export const user = 'Developer';
const ws = process.env.TEST_WS ?? '';
const app = process.env.TEST_APP ?? 'designer';
const pmv = 'cms-test-project';

export class CmsEditor {
  readonly page: Page;
  readonly html: Locator;
  readonly main: MainPanel;
  readonly detail: DetailPanel;

  constructor(page: Page) {
    this.page = page;
    this.html = this.page.locator('html');
    this.main = new MainPanel(this.page);
    this.detail = new DetailPanel(this.page);
  }

  async expectToBeLight() {
    await expect(this.html).toHaveClass('light');
  }

  async expectToBeDark() {
    await expect(this.html).toHaveClass('dark');
  }

  static async openCms(page: Page, options?: { readonly?: boolean; theme?: string }) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    let url = `?server=${serverUrl}${ws}&app=${app}&pmv=${pmv}`;
    if (options) {
      url += `${this.params(options)}`;
    }
    return this.openUrl(page, url);
  }

  static async openMock(page: Page, options?: { readonly?: boolean; app?: string }) {
    let params = '';
    if (options) {
      params = '?';
      params += this.params(options);
    }
    return this.openUrl(page, `/mock.html${params}`);
  }

  private static params(options: Record<string, string | boolean>) {
    let params = '';
    params += Object.entries(options)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
    return params;
  }

  private static async openUrl(page: Page, url: string) {
    const editor = new CmsEditor(page);
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    return editor;
  }

  async takeScreenshot(fileName: string) {
    await this.hideQuery();
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async hideQuery() {
    await this.page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }
}
