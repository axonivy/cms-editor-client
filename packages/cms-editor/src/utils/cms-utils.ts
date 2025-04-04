import type { MapStringString } from '@axonivy/cms-editor-protocol';

export const removeValue = (values: MapStringString, languageTag: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [languageTag]: _, ...newValues } = values;
  return newValues;
};
