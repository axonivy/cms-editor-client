import type { CmsEditorDataContext } from '@axonivy/cms-editor-protocol';
import i18next from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useMeta } from './protocol/use-meta';

export const defaultLanguageTagKey = 'defaultLanguageTag' as const;

export const useLanguage = (context: CmsEditorDataContext) => {
  const clientLanguageTag = i18next.language;
  const languageDisplayName = useMemo(() => new Intl.DisplayNames([clientLanguageTag], { type: 'language' }), [clientLanguageTag]);

  const locales = useMeta('meta/locales', context, []);
  const [defaultLanguageTag, setDefaultLanguageTagState] = useState(defaultLanguage(locales.data, clientLanguageTag));
  const setDefaultLanguageTag = (languageTag: string) => {
    setDefaultLanguageTagState(languageTag);
    localStorage.setItem(defaultLanguageTagKey, languageTag);
  };
  useEffect(() => setDefaultLanguageTagState(defaultLanguage(locales.data, clientLanguageTag)), [locales.data, clientLanguageTag]);

  return { defaultLanguageTag, setDefaultLanguageTag, languageDisplayName };
};

const defaultLanguage = (locales: Array<string>, clientLanguageTag: string) => {
  const defaultLanguageTag = localStorage.getItem(defaultLanguageTagKey);
  if (defaultLanguageTag) {
    return defaultLanguageTag;
  }
  if (locales.includes(clientLanguageTag) || locales.length === 0) {
    return clientLanguageTag;
  }
  if (locales.includes('en')) {
    return 'en';
  }
  return locales[0];
};
