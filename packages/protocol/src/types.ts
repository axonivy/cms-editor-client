import type { CmsData, CmsDataObject, CmsEditorDataContext, MapStringString } from './editor';

export type EditorProps = { context: CmsEditorDataContext };

export type { CmsDataObject as ContentObject };
export type Locales = MapStringString;

export interface Client {
  data(context: CmsEditorDataContext): Promise<CmsData>;
  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
}

export interface ClientContext {
  client: Client;
}

export interface MetaRequestTypes {
  'meta/locales': [CmsEditorDataContext, Locales];
}

export interface RequestTypes extends MetaRequestTypes {
  data: [CmsEditorDataContext, CmsData];
}
