import type { ContentObject, MapStringString } from '@axonivy/cms-editor-protocol';
import { type Row } from '@tanstack/react-table';
import { globalFilterFn } from './MainContent';

test('globalFilterFn', () => {
  expect(globalFilterFn({ original: { uri: '', values: { en: '' } as MapStringString } } as Row<ContentObject>, '', 'filter')).toBeFalsy();
  expect(globalFilterFn({ original: { uri: 'xfilterx' } } as Row<ContentObject>, '', 'filter')).toBeTruthy();
  expect(
    globalFilterFn({ original: { uri: '', values: { en: 'xfilterx' } as MapStringString } } as Row<ContentObject>, '', 'filter')
  ).toBeTruthy();
  expect(
    globalFilterFn({ original: { uri: '', values: { en: '', de: 'xFiLtErx' } as MapStringString } } as Row<ContentObject>, '', 'fiLTer')
  ).toBeTruthy();
});
