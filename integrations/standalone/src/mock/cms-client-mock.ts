import type { Client, CmsActionArgs, CmsData, Locales } from '@axonivy/cms-editor-protocol';
import { contentObjects } from './data';
import { locales } from './meta';

export class CmsClientMock implements Client {
  private cmsData: CmsData = contentObjects;

  data(): Promise<CmsData> {
    return Promise.resolve(this.cmsData);
  }

  meta(): Promise<Locales> {
    return Promise.resolve(locales);
  }

  action(action: CmsActionArgs): void {
    console.log(`Action: ${JSON.stringify(action)}`);
  }
}
