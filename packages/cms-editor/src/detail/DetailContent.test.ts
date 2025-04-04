import type { CmsData, MapStringString } from '@axonivy/cms-editor-protocol';
import { removeValueFromContentObjectInData } from './DetailContent';

test('removeValueFromContentObjectInData', () => {
  const data = {
    data: [
      { uri: 'uriOne', values: { en: 'englishOne', de: 'deutschEins' } as MapStringString },
      { uri: 'uriTwo', values: { en: 'englishTwo', de: 'deutschZwei' } as MapStringString }
    ]
  } as CmsData;
  expect(removeValueFromContentObjectInData(data, 'uriOne', 'de')).toEqual({
    data: [
      { uri: 'uriOne', values: { en: 'englishOne' } },
      { uri: 'uriTwo', values: { en: 'englishTwo', de: 'deutschZwei' } }
    ]
  });
  expect(removeValueFromContentObjectInData(data, 'uriTwo', 'en')).toEqual({
    data: [
      { uri: 'uriOne', values: { en: 'englishOne', de: 'deutschEins' } },
      { uri: 'uriTwo', values: { de: 'deutschZwei' } }
    ]
  });
});
