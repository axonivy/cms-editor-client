import type { CmsData, CmsDeleteValueArgs, CmsUpdateValueArgs, ContentObject, MapStringString } from '@axonivy/cms-editor-protocol';
import { BasicField, BasicInput, Flex, PanelMessage, Spinner, type Unary } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CmsValueField } from '../components/CmsValueField';
import { useAppContext } from '../context/AppContext';
import { toLanguages } from '../main/control/language-tool/language-utils';
import { useClient } from '../protocol/ClientContextProvider';
import { useMeta } from '../protocol/use-meta';
import { useQueryKeys } from '../query/query-client';
import { removeValue } from '../utils/cms-utils';
import './DetailContent.css';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { context, contentObjects, selectedContentObject, defaultLanguageTags, languageDisplayName } = useAppContext();

  const client = useClient();
  const queryClient = useQueryClient();
  const { dataKey, readKey } = useQueryKeys();

  const uri = selectedContentObject !== undefined ? (contentObjects[selectedContentObject]?.uri ?? '') : '';

  const updateValuesInReadQuery = useCallback(
    (uri: string, valueUpdater: Unary<MapStringString>) =>
      queryClient.setQueryData<ContentObject>(readKey({ context, uri }), data => {
        if (!data) {
          return;
        }
        return { ...data, values: valueUpdater(data.values) };
      }),
    [context, queryClient, readKey]
  );

  const updateValuesInDataQuery = useCallback(
    (uri: string, valueUpdater: Unary<MapStringString>) =>
      queryClient.setQueryData<CmsData>(dataKey({ context, languageTags: defaultLanguageTags }), data => {
        if (!data) {
          return;
        }
        return updateValuesOfContentObjectInData(data, uri, valueUpdater);
      }),
    [context, dataKey, defaultLanguageTags, queryClient]
  );

  const updateMutation = useMutation({
    mutationFn: async (args: CmsUpdateValueArgs) => {
      const changeValueUpdater = (values: MapStringString) => ({ ...values, [args.updateObject.languageTag]: args.updateObject.value });
      updateValuesInReadQuery(args.updateObject.uri, changeValueUpdater);
      if (defaultLanguageTags.includes(args.updateObject.languageTag)) {
        updateValuesInDataQuery(args.updateObject.uri, changeValueUpdater);
      }
      return client.updateValue(args);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (args: CmsDeleteValueArgs) => {
      const deleteValueUpdater = (values: MapStringString) => removeValue(values, args.deleteObject.languageTag);
      updateValuesInReadQuery(args.deleteObject.uri, deleteValueUpdater);
      if (defaultLanguageTags.includes(args.deleteObject.languageTag)) {
        updateValuesInDataQuery(args.deleteObject.uri, deleteValueUpdater);
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
        {toLanguages(locales, languageDisplayName).map(language => (
          <CmsValueField
            key={language.value}
            values={contentObject.values}
            updateValue={(languageTag: string, value: string) =>
              updateMutation.mutate({ context, updateObject: { uri, languageTag, value } })
            }
            deleteValue={(languageTag: string) => deleteMutation.mutate({ context, deleteObject: { uri, languageTag } })}
            label={language.label}
            languageTag={language.value}
            disabledDelete={hasExactlyOneValue}
            deleteTooltip={hasExactlyOneValue && contentObject.values[language.value] !== undefined ? t('value.lastValue') : undefined}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export const updateValuesOfContentObjectInData = (data: CmsData, uri: string, valueUpdater: Unary<MapStringString>) => {
  const index = data.data.findIndex(co => co.uri === uri);
  if (index === -1) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const co = data.data[index]!;
  const newCo = { ...co, values: valueUpdater(co.values) };
  const newData = [...data.data];
  newData[index] = newCo;
  return { ...data, data: newData };
};
