import type { CmsActionArgs, CmsData, CmsDataArgs, CmsDataObject, CmsEditorDataContext, CmsReadArgs } from './editor';

export type EditorProps = { context: CmsEditorDataContext };

export type { CmsDataObject as ContentObject };

export interface Client {
  data(args: CmsDataArgs): Promise<CmsData>;
  read(args: CmsReadArgs): Promise<CmsDataObject>;
  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
  action(action: CmsActionArgs): void;
}

export interface ClientContext {
  client: Client;
}

export interface MetaRequestTypes {
  'meta/locales': [CmsEditorDataContext, Array<string>];
}

export interface RequestTypes extends MetaRequestTypes {
  data: [CmsDataArgs, CmsData];
  read: [CmsReadArgs, CmsDataObject];
}

export interface NotificationTypes {
  action: CmsActionArgs;
}
