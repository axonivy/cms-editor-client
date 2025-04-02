import type { ContentObject } from '@axonivy/cms-editor-protocol';
import { initialNamespace, namespaceOptions } from './AddContentObject';

test('initialNamespace', () => {
  const contentObjects = [{ uri: '/contentObject' }, { uri: '/folder/deep/contentObject' }] as Array<ContentObject>;
  expect(initialNamespace(contentObjects, undefined)).toEqual('');
  expect(initialNamespace(contentObjects, 0)).toEqual('');
  expect(initialNamespace(contentObjects, 1)).toEqual('/folder/deep');
});

test('namespaceOptions', () => {
  expect(
    namespaceOptions([
      { uri: '/a' },
      { uri: '/b' },
      { uri: '/c/a' },
      { uri: '/c/b' },
      { uri: '/c/c/a' },
      { uri: '/c/c/b' },
      { uri: '/d/a' }
    ] as Array<ContentObject>)
  ).toEqual([{ value: '' }, { value: '/c' }, { value: '/c/c' }, { value: '/d' }]);
});
