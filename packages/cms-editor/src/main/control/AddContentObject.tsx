import type { CmsData, ContentObject, MapStringString } from '@axonivy/cms-editor-protocol';
import {
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  hotkeyText,
  Input,
  selectRow,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey, useQueryKeys } from '../../query/query-client';
import { useKnownHotkeys } from '../../utils/hotkeys';
import { useClientLanguage } from '../../utils/use-client-language';

type AddContentObjectProps = {
  table: Table<ContentObject>;
};

export const AddContentObject = ({ table }: AddContentObjectProps) => {
  const { t } = useTranslation();
  const { context, contentObjects, selectedContentObject, setSelectedContentObject } = useAppContext();

  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      initializeDialog();
    }
  };

  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [values, setValues] = useState<MapStringString>({});

  const locales = useMeta('meta/locales', context, []).data;
  const { clientLanguageTag, languageDisplayName } = useClientLanguage();
  const isClientLanguageInCms = useMemo(() => locales.includes(clientLanguageTag), [clientLanguageTag, locales]);

  const initializeDialog = () => {
    setName('NewContentObject');
    setNamespace(initialNamespace(contentObjects, selectedContentObject));
    setValues(isClientLanguageInCms ? { [clientLanguageTag]: '' } : {});
  };

  const changeValue = (languageTag: string, value: string) => {
    const newValues = structuredClone(values);
    newValues[languageTag] = value;
    setValues(newValues);
  };

  const client = useClient();
  const queryClient = useQueryClient();
  const { dataKey } = useQueryKeys();
  const addContentObject = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    const uri = `${namespace}/${name}`;
    client.create({ context, contentObject: { uri, type: 'STRING', values } });
    queryClient.invalidateQueries({ queryKey: genQueryKey('data') }).then(() => {
      const data: CmsData | undefined = queryClient.getQueryData(dataKey({ context, languageTags: [clientLanguageTag] }));
      const selectedContentObject = data?.data
        .filter((contentObject: ContentObject) => contentObject.type !== 'FOLDER')
        .findIndex(co => co.uri === uri);
      setSelectedContentObject(selectedContentObject);
      selectRow(table, String(selectedContentObject));
      setOpen(event.ctrlKey || event.metaKey);
    });
  };

  const { addContentObject: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const enter = useHotkeys(['Enter', 'mod+Enter'], e => addContentObject(e), { scopes: ['global'], enabled: open, enableOnFormTags: true });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.Plus} aria-label={shortcut.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('dialog.addContentObject.title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('dialog.addContentObject.description')}</DialogDescription>
        <Flex direction='column' gap={3} ref={enter} tabIndex={-1}>
          <BasicField label={t('common:label.name')} aria-label={t('common:label.name')}>
            <Input value={name} onChange={event => setName(event.target.value)} />
          </BasicField>
          <BasicField label={t('common:label.namespace')} aria-label={t('common:label.namespace')}>
            <Input value={namespace} onChange={event => setNamespace(event.target.value)} />
          </BasicField>
          {isClientLanguageInCms && (
            <BasicField
              label={languageDisplayName.of(clientLanguageTag)}
              aria-label={languageDisplayName.of(clientLanguageTag)}
              className='cms-editor-add-dialog-default-locale'
            >
              <Textarea value={values[clientLanguageTag]} onChange={event => changeValue(clientLanguageTag, event.target.value)} />
            </BasicField>
          )}
        </Flex>
        <DialogFooter>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='primary' size='large' aria-label={t('dialog.addContentObject.create')} onClick={addContentObject}>
                  {t('dialog.addContentObject.create')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('dialog.addContentObject.createTooltip', { modifier: hotkeyText('mod') })}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const initialNamespace = (contentObjects: Array<ContentObject>, selectedContentObject?: number) => {
  if (selectedContentObject === undefined) {
    return '';
  }
  const uri = contentObjects[selectedContentObject].uri;
  return uri.substring(0, uri.lastIndexOf('/'));
};
