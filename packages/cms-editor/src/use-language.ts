import type { CmsEditorDataContext } from '@axonivy/cms-editor-protocol';
import i18next from 'i18next';
import { useMemo } from 'react';
import { useMeta } from './protocol/use-meta';

export const useLanguage = (context: CmsEditorDataContext) => {
  const clientLanguageTag = i18next.language;
  const languageDisplayName = useMemo(() => new Intl.DisplayNames([clientLanguageTag], { type: 'language' }), [clientLanguageTag]);

  const locales = useMeta('meta/locales', context, []);
  const defaultLanguageTag = useMemo(() => defaultLanguage(locales.data, clientLanguageTag), [locales.data, clientLanguageTag]);

  return { defaultLanguageTag, languageDisplayName };
};

const defaultLanguage = (locales: Array<string>, clientLanguageTag: string) => {
  if (locales.includes(clientLanguageTag) || locales.length === 0) {
    return clientLanguageTag;
  }
  if (locales.includes('en')) {
    return 'en';
  }
  return locales[0];
};
