export default {
  defaultNamespace: 'cms-editor',
  defaultValue: '__MISSING_TRANSLATION__',
  keepRemoved: false,
  locales: ['en', 'de', 'jp'],
  output: 'src/translation/$NAMESPACE/$LOCALE.json',
  pluralSeparator: '_',
  input: ['src/**/*.ts', 'src/**/*.tsx'],
  verbose: false,
  sort: true
};
