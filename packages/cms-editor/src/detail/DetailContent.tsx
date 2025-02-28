import { BasicField, BasicInput, Flex, PanelMessage, Textarea } from '@axonivy/ui-components';
import { useAppContext } from '../context/AppContext';
import { useMeta } from '../protocol/use-meta';
import './DetailContent.css';

export const DetailContent = () => {
  const { context, contentObjects, selectedContentObject } = useAppContext();
  const locales = useMeta('meta/locales', context, {}).data;

  const contentObject = selectedContentObject !== undefined ? contentObjects[selectedContentObject] : undefined;

  if (!contentObject) {
    return <PanelMessage message='Select a Content Object to edit its values.' />;
  }

  return (
    <Flex direction='column' gap={4} className='cms-editor-detail-content'>
      <BasicField label='URI'>
        <BasicInput value={contentObject.uri} disabled />
      </BasicField>
      {Object.entries(locales).map(([languageCode, displayName]) => (
        <BasicField key={languageCode} label={displayName}>
          <Textarea value={contentObject.values[languageCode]} />
        </BasicField>
      ))}
    </Flex>
  );
};
