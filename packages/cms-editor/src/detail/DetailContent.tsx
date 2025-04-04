import type { CmsData, CmsDeleteValueArgs, CmsDeleteValueObject, ContentObject } from '@axonivy/cms-editor-protocol';
import { BasicField, BasicInput, Flex, PanelMessage, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CmsValueField } from '../components/CmsValueField';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../protocol/ClientContextProvider';
import { useMeta } from '../protocol/use-meta';
import { useQueryKeys } from '../query/query-client';
import { removeValue } from '../utils/cms-utils';
import './DetailContent.css';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { context, contentObjects, selectedContentObject, defaultLanguageTag } = useAppContext();

  const client = useClient();
  const queryClient = useQueryClient();
  const { dataKey, readKey } = useQueryKeys();

  const uri = selectedContentObject !== undefined ? contentObjects[selectedContentObject].uri : '';

  const removeValueFromReadQuery = useCallback(
    (deleteObject: CmsDeleteValueObject) =>
      queryClient.setQueryData<ContentObject>(readKey({ context, uri: deleteObject.uri }), data => {
        if (!data) {
          return;
        }
        return { ...data, values: removeValue(data.values, deleteObject.languageTag) };
      }),
    [context, queryClient, readKey]
  );

  const removeValueFromDataQuery = useCallback(
    (deleteObject: CmsDeleteValueObject) =>
      queryClient.setQueryData<CmsData>(dataKey({ context, languageTags: [defaultLanguageTag] }), data => {
        if (!data) {
          return;
        }
        return removeValueFromContentObjectInData(data, deleteObject.uri, deleteObject.languageTag);
      }),
    [context, dataKey, defaultLanguageTag, queryClient]
  );

  const deleteMutation = useMutation({
    mutationFn: async (args: CmsDeleteValueArgs) => {
      removeValueFromReadQuery(args.deleteObject);
      if (args.deleteObject.languageTag === defaultLanguageTag) {
        removeValueFromDataQuery(args.deleteObject);
      }
      return client.deleteValue(args);
    }
  });

  const {
    data: contentObject,
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: readKey({ context, uri }),
    queryFn: async () => await client.read({ context, uri }),
    structuralSharing: false
  });

  const locales = useMeta('meta/locales', context, []).data;

  if (selectedContentObject == undefined) {
    return <PanelMessage message={t('message.emptyDetail')} />;
  }

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.error', { error })} />;
  }

  const hasExactlyOneValue = Object.keys(contentObject.values).length === 1;

  return (
    <Flex direction='column' gap={4} className='cms-editor-detail-content'>
      <BasicField label='URI'>
        <BasicInput value={contentObject.uri} disabled />
      </BasicField>
      <Flex direction='column' gap={4}>
        {locales.map(languageTag => (
          <CmsValueField
            key={languageTag}
            values={contentObject.values}
            updateValue={() => {}}
            deleteValue={(languageTag: string) => deleteMutation.mutate({ context, deleteObject: { uri, languageTag } })}
            languageTag={languageTag}
            disabledDelete={hasExactlyOneValue}
            message={
              hasExactlyOneValue && contentObject.values[languageTag] !== undefined
                ? { message: t('value.lastValue'), variant: 'info' }
                : undefined
            }
          />
        ))}
      </Flex>
    </Flex>
  );
};

export const removeValueFromContentObjectInData = (data: CmsData, uri: string, languageTag: string) => {
  const index = data.data.findIndex(co => co.uri === uri);
  if (index === -1) {
    return;
  }
  const co = data.data[index];
  const newCo = { ...co, values: removeValue(co.values, languageTag) };
  const newData = [...data.data];
  newData[index] = newCo;
  return { ...data, data: newData };
};
