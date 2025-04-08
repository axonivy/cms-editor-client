import { removeValue } from './cms-utils';

test('removeValue', () => {
  const values = { en: 'value', de: 'wert' };
  const newValues = removeValue(values, 'de');
  expect(newValues).toEqual({ en: 'value' });
});
