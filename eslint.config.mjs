import tseslint from 'typescript-eslint';
import config from '@axonivy/eslint-config';
import i18next from 'eslint-plugin-i18next';

export default tseslint.config(
  ...config.base,
  // TypeScript recommended configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    plugins: {
      i18next
    },

    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          markupOnly: false,
          framework: 'react',
          mode: 'jsx-only',
          'should-validate-template': true,
          'jsx-attributes': { include: ['title', 'aria-label', 'label', 'tag-label', 'info'] }
        }
      ]
    }
  },
  {
    name: 'ignore-files',
    ignores: ['**/i18next-parser.config.mjs']
  }
);
