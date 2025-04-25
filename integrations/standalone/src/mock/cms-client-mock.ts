import { removeValue } from '@axonivy/cms-editor';
import type {
  Client,
  CmsActionArgs,
  CmsCreateArgs,
  CmsData,
  CmsDataObject,
  CmsDeleteArgs,
  CmsDeleteValueArgs,
  CmsReadArgs,
  CmsRemoveLocalesArgs,
  CmsUpdateValueArgs,
  MetaRequestTypes,
  Void
} from '@axonivy/cms-editor-protocol';
import { contentObjects } from './data';
import { locales, supportedLocales } from './meta';

export class CmsClientMock implements Client {
  private cmsData: CmsData = contentObjects;
  private localesData: Array<string> = locales;

  data(): Promise<CmsData> {
    return Promise.resolve(this.cmsData);
  }

  async create(args: CmsCreateArgs): Promise<Void> {
    const uri = args.contentObject.uri;
    if (uri.endsWith('IsPending')) {
      await new Promise(res => setTimeout(res, 1000));
    } else if (uri.endsWith('IsError')) {
      throw Error('error message');
    }
    this.cmsData.data.push(args.contentObject);
    this.cmsData.data.sort((co1, co2) => co1.uri.localeCompare(co2.uri));
    return Promise.resolve({});
  }

  read(args: CmsReadArgs): Promise<CmsDataObject> {
    return Promise.resolve(this.cmsData.data.find(data => data.uri === args.uri) ?? ({} as CmsDataObject));
  }

  updateValue(args: CmsUpdateValueArgs): void {
    const co = this.cmsData.data.find(co => co.uri === args.updateObject.uri);
    if (co) {
      co.values = { ...co.values, [args.updateObject.languageTag]: args.updateObject.value };
    }
  }

  deleteValue(args: CmsDeleteValueArgs): void {
    const co = this.cmsData.data.find(co => co.uri === args.deleteObject.uri);
    if (co) {
      co.values = removeValue(co.values, args.deleteObject.languageTag);
    }
  }

  delete(args: CmsDeleteArgs): void {
    this.cmsData = { ...this.cmsData, data: this.cmsData.data.filter(co => co.uri !== args.uri) };
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/supportedLocales':
        return Promise.resolve(supportedLocales);
      case 'meta/locales':
        return Promise.resolve(this.localesData);
      case 'meta/removeLocales':
        this.localesData = this.localesData.filter(locale => !(args as CmsRemoveLocalesArgs).locales.includes(locale));
        return Promise.resolve({});
      default:
        throw Error('meta path not implemented');
    }
  }

  action(action: CmsActionArgs): void {
    console.log(`Action: ${JSON.stringify(action)}`);
  }
}
