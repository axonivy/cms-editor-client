import type { ContentObject } from '@axonivy/cms-editor-protocol';
import { createContext, useContext } from 'react';

type AppContext = {
  contentObjects: Array<ContentObject>;
  selectedContentObject?: number;
  setSelectedContentObject: (index?: number) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
};

const appContext = createContext<AppContext>({
  contentObjects: [],
  selectedContentObject: undefined,
  setSelectedContentObject: () => {},
  detail: true,
  setDetail: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext => {
  return useContext(appContext);
};
