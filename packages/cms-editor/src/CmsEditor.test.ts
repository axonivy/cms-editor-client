import type { Client, CmsEditorDataContext, ContentObject } from '@axonivy/cms-editor-protocol';
import { waitFor } from '@testing-library/react';
import i18next from 'i18next';
import { toolbarTitles, useLanguage } from './CmsEditor';
import { customRenderHook } from './context/test-utils/test-utils';

test('toolbarTitles', () => {
  expect(toolbarTitles('pmv-name')).toEqual({ mainTitle: 'CMS - pmv-name', detailTitle: 'CMS - pmv-name' });
  expect(toolbarTitles('pmv-name', { uri: 'content-object-uri' } as ContentObject)).toEqual({
    mainTitle: 'CMS - pmv-name',
    detailTitle: 'CMS - pmv-name - content-object-uri'
  });
  expect(toolbarTitles('pmv-name', { uri: 'folder/content-object-uri' } as ContentObject)).toEqual({
    mainTitle: 'CMS - pmv-name',
    detailTitle: 'CMS - pmv-name - content-object-uri'
  });
});

test('useLanguage', async () => {
  let result = renderLanguageHook('de', []).result;
  expect(result.current.defaultLanguageTag).toEqual('de');
  expect(result.current.languageDisplayName.resolvedOptions().locale).toEqual('de');

  result = renderLanguageHook('de', ['ja', 'en']).result;
  await waitFor(() => {
    expect(result.current.defaultLanguageTag).toEqual('en');
  });
  expect(result.current.languageDisplayName.resolvedOptions().locale).toEqual('de');

  result = renderLanguageHook('de', ['ja', 'fr']).result;
  await waitFor(() => {
    expect(result.current.defaultLanguageTag).toEqual('ja');
  });
  expect(result.current.languageDisplayName.resolvedOptions().locale).toEqual('de');
});

const renderLanguageHook = (clientLanguage: string, locales: Array<string>) => {
  i18next.language = clientLanguage;
  return customRenderHook(() => useLanguage({} as CmsEditorDataContext), {
    wrapperProps: { clientContext: { client: new TestClient(locales) } }
  });
};

class TestClient implements Partial<Client> {
  private readonly locales: Array<string>;

  constructor(locales: Array<string>) {
    this.locales = locales;
  }

  meta(): Promise<Array<string>> {
    return Promise.resolve(this.locales);
  }
}
