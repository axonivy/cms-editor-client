import type { CmsCreateArgs, CmsData, ContentObject, MapStringString } from '@axonivy/cms-editor-protocol';
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
  Message,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey, useQueryKeys } from '../../query/query-client';
import { useKnownHotkeys } from '../../utils/hotkeys';
import { useClientLanguage } from '../../utils/use-client-language';

type AddContentObjectProps = {
  selectRow: (rowId: string) => void;
};

export const AddContentObject = ({ selectRow }: AddContentObjectProps) => {
  const { t } = useTranslation();
  const { context, contentObjects, selectedContentObject, setSelectedContentObject } = useAppContext();

  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    if (isPending) {
      return;
    }
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
    setValues(values => ({
      ...values,
      [languageTag]: value
    }));
  };

  const client = useClient();
  const queryClient = useQueryClient();
  const { dataKey } = useQueryKeys();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (args: CmsCreateArgs) => client.create(args),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: genQueryKey('data') })
  });

  const addContentObject = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    const uri = `${namespace}/${name}`;
    mutate(
      { context, contentObject: { uri, type: 'STRING', values } },
      {
        onSuccess: () => {
          const data: CmsData | undefined = queryClient.getQueryData(dataKey({ context, languageTags: [clientLanguageTag] }));
          const selectedContentObject = data?.data
            .filter((contentObject: ContentObject) => contentObject.type !== 'FOLDER')
            .findIndex(co => co.uri === uri);
          setSelectedContentObject(selectedContentObject);
          selectRow(String(selectedContentObject));
          setOpen(event.ctrlKey || event.metaKey);
        }
      }
    );
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
          <BasicField label={t('common:label.name')}>
            <Input value={name} onChange={event => setName(event.target.value)} disabled={isPending} />
          </BasicField>
          <BasicField label={t('common:label.namespace')}>
            <Input value={namespace} onChange={event => setNamespace(event.target.value)} disabled={isPending} />
          </BasicField>
          {isClientLanguageInCms && (
            <BasicField label={languageDisplayName.of(clientLanguageTag)} className='cms-editor-add-dialog-default-locale'>
              <Textarea
                value={values[clientLanguageTag]}
                onChange={event => changeValue(clientLanguageTag, event.target.value)}
                disabled={isPending}
              />
            </BasicField>
          )}
          {isError && <Message variant='error' message={t('message.error', { error })} className='cms-editor-add-dialog-error-message' />}
        </Flex>
        <DialogFooter>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='primary'
                  size='large'
                  aria-label={t('dialog.addContentObject.create')}
                  onClick={addContentObject}
                  disabled={isPending}
                  icon={isPending ? IvyIcons.Spinner : undefined}
                  spin
                >
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
