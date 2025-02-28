import type { ContentObject, MapLocaleString } from '@axonivy/cms-editor-protocol';
import { type Row } from '@tanstack/react-table';
import { globalFilterFn } from './MainContent';

test('globalFilterFn', () => {
  expect(globalFilterFn({ original: { uri: '', values: { en: '' } as MapLocaleString } } as Row<ContentObject>, '', 'filter')).toBeFalsy();
  expect(globalFilterFn({ original: { uri: 'xfilterx' } } as Row<ContentObject>, '', 'filter')).toBeTruthy();
  expect(
    globalFilterFn({ original: { uri: '', values: { en: 'xfilterx' } as MapLocaleString } } as Row<ContentObject>, '', 'filter')
  ).toBeTruthy();
  expect(
    globalFilterFn({ original: { uri: '', values: { en: '', de: 'xFiLtErx' } as MapLocaleString } } as Row<ContentObject>, '', 'fiLTer')
  ).toBeTruthy();
});
