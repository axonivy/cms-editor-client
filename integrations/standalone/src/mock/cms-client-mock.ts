import type { Client, CmsActionArgs, CmsCreateArgs, CmsData, CmsDataObject, CmsReadArgs } from '@axonivy/cms-editor-protocol';
import { contentObjects } from './data';
import { locales } from './meta';

export class CmsClientMock implements Client {
  private cmsData: CmsData = contentObjects;

  data(): Promise<CmsData> {
    return Promise.resolve(this.cmsData);
  }

  async create(args: CmsCreateArgs): Promise<void> {
    const uri = args.contentObject.uri;
    if (uri.endsWith('IsPending')) {
      await new Promise(res => setTimeout(res, 1000));
    } else if (uri.endsWith('IsError')) {
      throw Error('error message');
    }
    this.cmsData.data.push(args.contentObject);
    this.cmsData.data.sort((co1, co2) => co1.uri.localeCompare(co2.uri));
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
