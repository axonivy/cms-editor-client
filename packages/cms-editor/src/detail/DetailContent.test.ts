import type { CmsData, MapStringString } from '@axonivy/cms-editor-protocol';
import { updateValuesOfContentObjectInData } from './DetailContent';

test('updateValuesOfContentObjectInData', () => {
  const data = {
    data: [
      { uri: 'uriOne', values: { en: 'englishOne', de: 'deutschEins' } as MapStringString },
      { uri: 'uriTwo', values: { en: 'englishTwo', de: 'deutschZwei' } as MapStringString }
    ]
  } as CmsData;
  expect(updateValuesOfContentObjectInData(data, 'uriOne', () => ({ new: 'values' }))).toEqual({
    data: [
      { uri: 'uriOne', values: { new: 'values' } },
      { uri: 'uriTwo', values: { en: 'englishTwo', de: 'deutschZwei' } }
    ]
  });
  expect(updateValuesOfContentObjectInData(data, 'uriTwo', () => ({ new: 'values' }))).toEqual({
    data: [
      { uri: 'uriOne', values: { en: 'englishOne', de: 'deutschEins' } },
      { uri: 'uriTwo', values: { new: 'values' } }
    ]
  });
});
