import type { CmsEditorDataContext } from '@axonivy/cms-editor-protocol';
import i18next from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useMeta } from './protocol/use-meta';

export const defaultLanguageTagsKey = 'defaultLanguageTags' as const;

export const useLanguages = (context: CmsEditorDataContext) => {
  const clientLanguageTag = i18next.language;
  const languageDisplayName = useMemo(() => new Intl.DisplayNames([clientLanguageTag], { type: 'language' }), [clientLanguageTag]);

  const locales = useMeta('meta/locales', context, []);
  const [defaultLanguageTags, setDefaultLanguageTagsState] = useState(defaultLanguages(locales.data, clientLanguageTag));
  const setDefaultLanguageTags = (languageTags: Array<string>) => {
    setDefaultLanguageTagsState(languageTags);
    localStorage.setItem(defaultLanguageTagsKey, JSON.stringify(languageTags));
  };
  useEffect(() => setDefaultLanguageTagsState(defaultLanguages(locales.data, clientLanguageTag)), [locales.data, clientLanguageTag]);

  return { defaultLanguageTags, setDefaultLanguageTags, languageDisplayName };
};

const defaultLanguages = (locales: Array<string>, clientLanguageTag: string): Array<string> => {
  const defaultLanguageTags = localStorage.getItem(defaultLanguageTagsKey);
  if (defaultLanguageTags) {
    return JSON.parse(defaultLanguageTags);
  }
  if (locales.includes(clientLanguageTag) || locales.length === 0) {
    return [clientLanguageTag];
  }
  if (locales.includes('en')) {
    return ['en'];
  }
  return [locales[0]];
};
