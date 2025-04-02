import type { Client, CmsEditorDataContext } from '@axonivy/cms-editor-protocol';
import { waitFor } from '@testing-library/react';
import { customRenderHook } from './context/test-utils/test-utils';
import { useLanguage } from './use-language';

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
