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
    setDefaultLanguageTagsLocalStorage(languageTags);
  };
  useEffect(() => setDefaultLanguageTagsState(defaultLanguages(locales.data, clientLanguageTag)), [locales.data, clientLanguageTag]);

  return { defaultLanguageTags, setDefaultLanguageTags, languageDisplayName };
};

const defaultLanguages = (locales: Array<string>, clientLanguageTag: string): Array<string> => {
  if (locales.length == 0) {
    return [clientLanguageTag];
  }
  const defaultLanguageTags = localStorage.getItem(defaultLanguageTagsKey);
  if (defaultLanguageTags) {
    return updateDefaultLanguageTags(JSON.parse(defaultLanguageTags), locales);
  }
  if (locales.includes(clientLanguageTag)) {
    return [clientLanguageTag];
  }
  if (locales.includes('en')) {
    return ['en'];
  }
  return [locales[0]];
};

const updateDefaultLanguageTags = (defaultLanguageTags: Array<string>, locales: Array<string>) => {
  if (defaultLanguageTags.every(languageTag => locales.includes(languageTag))) {
    return defaultLanguageTags;
  }
  const defaultLanguages = defaultLanguageTags.filter(languageTag => locales.includes(languageTag));
  setDefaultLanguageTagsLocalStorage(defaultLanguages);
  return defaultLanguages;
};

const setDefaultLanguageTagsLocalStorage = (languageTags: Array<string>) =>
  localStorage.setItem(defaultLanguageTagsKey, JSON.stringify(languageTags));
