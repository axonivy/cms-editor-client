import type { CmsData, CmsDataObject, CmsEditorDataContext } from './editor';

export type EditorProps = { context: CmsEditorDataContext };

export type { CmsDataObject as ContentObject };

export interface Client {
  data(context: CmsEditorDataContext): Promise<CmsData>;
}

export interface ClientContext {
  client: Client;
}

export interface RequestTypes {
  data: [CmsEditorDataContext, CmsData];
}
