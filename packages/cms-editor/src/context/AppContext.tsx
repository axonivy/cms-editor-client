import type { CmsEditorDataContext, ContentObject } from '@axonivy/cms-editor-protocol';
import { createContext, useContext } from 'react';

type AppContext = {
  context: CmsEditorDataContext;
  contentObjects: Array<ContentObject>;
  selectedContentObject?: number;
  setSelectedContentObject: (index?: number) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  defaultLanguageTag: string;
  languageDisplayName: Intl.DisplayNames;
};

const appContext = createContext<AppContext>({
  context: { app: '', pmv: '', file: '' },
  contentObjects: [],
  selectedContentObject: undefined,
  setSelectedContentObject: () => {},
  detail: true,
  setDetail: () => {},
  defaultLanguageTag: '',
  languageDisplayName: new Intl.DisplayNames(undefined, { type: 'language' })
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext => {
  return useContext(appContext);
};
