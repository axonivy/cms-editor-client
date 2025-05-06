import type { CmsEditorDataContext } from '@axonivy/cms-editor-protocol';
import i18next from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useMeta } from './protocol/use-meta';

export const useLanguages = (context: CmsEditorDataContext) => {
  const clientLanguageTag = i18next.language;
  const languageDisplayName = useMemo(() => new Intl.DisplayNames([clientLanguageTag], { type: 'language' }), [clientLanguageTag]);

  const locales = useMeta('meta/locales', context, []);
  const [defaultLanguageTags, setDefaultLanguageTagsState] = useState(defaultLanguages(locales.data, clientLanguageTag, context));
  const setDefaultLanguageTags = (languageTags: Array<string>) => {
    setDefaultLanguageTagsState(languageTags);
    setDefaultLanguageTagsLocalStorage(languageTags, context);
  };
  useEffect(
    () => setDefaultLanguageTagsState(defaultLanguages(locales.data, clientLanguageTag, context)),
    [clientLanguageTag, context, locales.data]
  );

  return { defaultLanguageTags, setDefaultLanguageTags, languageDisplayName };
};

const defaultLanguages = (locales: Array<string>, clientLanguageTag: string, context: CmsEditorDataContext): Array<string> => {
  if (locales.length == 0) {
    return [];
  }
  const defaultLanguageTags = localStorage.getItem(defaultLanguageTagsKey(context));
  if (defaultLanguageTags) {
    return updateDefaultLanguageTags(JSON.parse(defaultLanguageTags), locales, context);
  }
  const defaultLanguages: Array<string> = [];
  if (locales.includes(clientLanguageTag)) {
    defaultLanguages.push(clientLanguageTag);
  } else if (locales.includes('en')) {
    defaultLanguages.push('en');
  } else {
    defaultLanguages.push(locales[0]);
  }
  setDefaultLanguageTagsLocalStorage(defaultLanguages, context);
  return defaultLanguages;
};

const updateDefaultLanguageTags = (defaultLanguageTags: Array<string>, locales: Array<string>, context: CmsEditorDataContext) => {
  if (defaultLanguageTags.every(languageTag => locales.includes(languageTag))) {
    return defaultLanguageTags;
  }
  const defaultLanguages = defaultLanguageTags.filter(languageTag => locales.includes(languageTag));
  setDefaultLanguageTagsLocalStorage(defaultLanguages, context);
  return defaultLanguages;
};

const setDefaultLanguageTagsLocalStorage = (languageTags: Array<string>, context: CmsEditorDataContext) =>
  localStorage.setItem(defaultLanguageTagsKey(context), JSON.stringify(languageTags));

const defaultLanguageTagsKey = (context: CmsEditorDataContext) => {
  return `${context.app}:${context.pmv}:defaultLanguageTags`;
};
