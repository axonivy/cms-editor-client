import type { Client, CmsEditorDataContext } from '@axonivy/cms-editor-protocol';
import { waitFor } from '@testing-library/react';
import { customRenderHook } from './context/test-utils/test-utils';
import { defaultLanguageTagKey, useLanguage } from './use-language';

afterEach(() => localStorage.clear());

test('default language set via local storage', async () => {
  localStorage.setItem(defaultLanguageTagKey, 'en');
  const view = renderLanguageHook('de', []);
  expect(view.result.current.defaultLanguageTag).toEqual('en');
  expect(view.result.current.languageDisplayName.resolvedOptions().locale).toEqual('de');

  view.result.current.setDefaultLanguageTag('ja');
  view.rerender();
  expect(view.result.current.defaultLanguageTag).toEqual('ja');
  expect(view.result.current.languageDisplayName.resolvedOptions().locale).toEqual('de');
  expect(localStorage.getItem(defaultLanguageTagKey)).toEqual('ja');
});

test('default language not set via local storage', async () => {
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
  return customRenderHook(() => useLanguage({} as CmsEditorDataContext), {
    wrapperProps: { clientLanguage: clientLanguage, clientContext: { client: new TestClient(locales) } }
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
