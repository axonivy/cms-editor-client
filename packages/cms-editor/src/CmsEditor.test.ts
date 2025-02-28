import type { ContentObject } from '@axonivy/cms-editor-protocol';
import { toolbarTitles } from './CmsEditor';

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
