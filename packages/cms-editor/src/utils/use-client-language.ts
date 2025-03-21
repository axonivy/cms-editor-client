import i18next from 'i18next';
import { useMemo } from 'react';

export const useClientLanguage = () => {
  const clientLanguageTag = i18next.language;
  const languageDisplayName = useMemo(() => new Intl.DisplayNames([clientLanguageTag], { type: 'language' }), [clientLanguageTag]);
  return { clientLanguageTag, languageDisplayName };
};
