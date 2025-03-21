import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslation, deTranslation, enCommonTranslation, deCommonTranslation } from '@axonivy/cms-editor';
import LanguageDetector from 'i18next-browser-languagedetector';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      debug: true,
      supportedLngs: ['en', 'de'],
      fallbackLng: 'en',
      ns: ['cms-editor'],
      defaultNS: 'cms-editor',
      resources: {
        en: { 'cms-editor': enTranslation, common: enCommonTranslation },
        de: { 'cms-editor': deTranslation, common: deCommonTranslation }
      }
    });
};
