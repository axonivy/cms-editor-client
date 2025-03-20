import type { Client, CmsActionArgs, CmsData, CmsDataObject, CmsReadArgs } from '@axonivy/cms-editor-protocol';
import { contentObjects } from './data';
import { locales } from './meta';

export class CmsClientMock implements Client {
  private cmsData: CmsData = contentObjects;

  data(): Promise<CmsData> {
    return Promise.resolve(this.cmsData);
  }

  read(args: CmsReadArgs): Promise<CmsDataObject> {
    return Promise.resolve(this.cmsData.data.find(data => data.uri === args.uri) ?? ({} as CmsDataObject));
  }

  meta(): Promise<Array<string>> {
    return Promise.resolve(locales);
  }

  action(action: CmsActionArgs): void {
    console.log(`Action: ${JSON.stringify(action)}`);
  }
}
