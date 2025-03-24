import type { ContentObject } from '@axonivy/cms-editor-protocol';
import { initialNamespace } from './AddContentObject';

test('initialNamespace', () => {
  const contentObjects = [{ uri: '/contentObject' }, { uri: '/folder/deep/contentObject' }] as Array<ContentObject>;
  expect(initialNamespace(contentObjects, undefined)).toEqual('');
  expect(initialNamespace(contentObjects, 0)).toEqual('');
  expect(initialNamespace(contentObjects, 1)).toEqual('/folder/deep');
});
