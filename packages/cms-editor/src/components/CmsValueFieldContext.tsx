import type { MapStringString } from '@axonivy/cms-editor-protocol';
import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

type CmsValueFieldContext = {
  values: MapStringString;
  setValues: Dispatch<SetStateAction<MapStringString>>;
};

const cmsValueFieldContext = createContext<CmsValueFieldContext>({
  values: {},
  setValues: () => {}
});

export const CmsValueFieldProvider = cmsValueFieldContext.Provider;

export const useCmsValueFieldContext = (): CmsValueFieldContext => {
  return useContext(cmsValueFieldContext);
};
