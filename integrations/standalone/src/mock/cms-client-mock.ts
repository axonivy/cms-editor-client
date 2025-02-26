import type { Client, CmsData } from '@axonivy/cms-editor-protocol';
import { contentObjects } from './data';

export class CmsClientMock implements Client {
  private cmsData: CmsData = contentObjects;

  data(): Promise<CmsData> {
    return Promise.resolve(this.cmsData);
  }
}
