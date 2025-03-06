import type { CmsActionArgs, CmsData, CmsDataObject, CmsEditorDataContext, MapLocaleString } from './editor';

export type EditorProps = { context: CmsEditorDataContext };

export type { CmsDataObject as ContentObject };
export type Locales = MapLocaleString;

export interface Client {
  data(context: CmsEditorDataContext): Promise<CmsData>;
  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
  action(action: CmsActionArgs): void;
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

export interface NotificationTypes {
  action: CmsActionArgs;
}
