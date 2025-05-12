import type { CmsAddLocalesArgs, CmsRemoveLocalesArgs } from '@axonivy/cms-editor-protocol';
import {
  BasicCheckbox,
  BasicField,
  Button,
  deepEqual,
  deleteFirstSelectedRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useTableKeyHandler,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useClient } from '../../../protocol/ClientContextProvider';
import { useMeta } from '../../../protocol/use-meta';
import { genQueryKey, useQueryKeys } from '../../../query/query-client';
import { getDefaultLanguageTagsLocalStorage } from '../../../use-languages';
import { useKnownHotkeys } from '../../../utils/hotkeys';
import { sortLanguages, toLanguages, type Language } from './language-utils';
import './LanguageTool.css';
import { LanguageToolControl } from './LanguageToolControl';

export const LanguageTool = () => {
  const { context, defaultLanguageTags, setDefaultLanguageTags, languageDisplayName } = useAppContext();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      initializeDialog();
    }
  };

  const initialDefaultLanguages = () => {
    const defaultLanguageTags = getDefaultLanguageTagsLocalStorage();
    if (!defaultLanguageTags) {
      return [];
    }
    return defaultLanguageTags;
  };

  const [defaultLanguages, setDefaultLanguages] = useState(initialDefaultLanguages());
  const [languages, setLanguages] = useState<Array<Language>>([]);

  const addLanguage = (language: Language) => setLanguages(languages => sortLanguages([...languages, language]));

  const deleteSelectedLanguage = () => {
    const { newData } = deleteFirstSelectedRow(table, languages);
    setLanguages(newData);
  };

  const locales = useMeta('meta/locales', context, []).data;

  const initializeDialog = () => {
    setDefaultLanguages(initialDefaultLanguages());
    setLanguages(toLanguages(locales, languageDisplayName));
    table.resetRowSelection();
  };

  const addDefaultLanguage = (languageTag: string) => setDefaultLanguages(languages => [...languages, languageTag]);
  const removeDefaultLanguage = (languageTag: string) =>
    setDefaultLanguages(languages => languages.filter(language => language !== languageTag));
  const onCheckedChange = (checked: boolean, languageTag: string) =>
    checked ? addDefaultLanguage(languageTag) : removeDefaultLanguage(languageTag);

  const selection = useTableSelect<Language>();
  const columns: Array<ColumnDef<Language, string>> = [
    {
      accessorKey: 'label',
      cell: cell => (
        <BasicCheckbox
          label={cell.getValue()}
          checked={defaultLanguages.includes(cell.row.original.value)}
          onCheckedChange={(checked: boolean) => onCheckedChange(checked, cell.row.original.value)}
        />
      )
    }
  ];
  const table = useReactTable<Language>({
    ...selection.options,
    data: languages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    }
  });

  const { handleKeyDown } = useTableKeyHandler({ table, data: languages });

  const client = useClient();
  const queryClient = useQueryClient();
  const { dataKey } = useQueryKeys();

  const addMutation = useMutation({
    mutationFn: async (args: CmsAddLocalesArgs) => {
      queryClient.setQueryData<Array<string>>(genQueryKey('meta/locales', context), locales =>
        locales ? [...locales, ...args.locales] : undefined
      );
      client.addLocales({ context, locales: args.locales });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (args: CmsRemoveLocalesArgs) => {
      queryClient.setQueryData<Array<string>>(genQueryKey('meta/locales', context), locales =>
        locales?.filter(locale => !args.locales.includes(locale))
      );
      client.removeLocales({ context, locales: args.locales });
    },
    onSuccess: () => {
      if (deepEqual(initialDefaultLanguages().sort(), defaultLanguages.sort())) {
        queryClient.invalidateQueries({ queryKey: dataKey({ context, languageTags: defaultLanguageTags }) });
      }
    }
  });

  const save = () => {
    const localesToDelete = locales.filter(locale => !languages.some(language => language.value === locale));
    if (localesToDelete.length !== 0) {
      deleteMutation.mutate({ context, locales: localesToDelete });
    }
    const localesToAdd = languages.map(language => language.value).filter(locale => !locales.includes(locale));
    if (localesToAdd.length !== 0) {
      addMutation.mutate({ context, locales: localesToAdd }, { onSuccess: () => setDefaultLanguageTags(defaultLanguages) });
    } else {
      setDefaultLanguageTags(defaultLanguages);
    }
    setOpen(false);
  };

  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.languageTool.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const deleteRef = useHotkeys(hotkeys.deleteLanguage.hotkey, () => deleteSelectedLanguage(), { scopes: ['global'] });
  const enter = useHotkeys(['Enter'], () => save(), { scopes: ['global'], enabled: open, enableOnFormTags: true });

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    if (event.code === 'Space') {
      const languageTag = table.getSelectedRowModel().flatRows[0]?.original.value;
      if (languageTag !== undefined) {
        onCheckedChange(!defaultLanguages.includes(languageTag), languageTag);
      }
    } else {
      handleKeyDown(event);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.Language} aria-label={hotkeys.languageTool.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{hotkeys.languageTool.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent
        ref={enter}
        onClick={() => table.resetRowSelection()}
        style={{ display: 'flex', flexDirection: 'column' }}
        className='cms-editor-language-tool-content'
      >
        <DialogHeader>
          <DialogTitle>{t('dialog.languageTool.title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('dialog.languageTool.description')}</DialogDescription>
        <BasicField
          className='cms-editor-language-tool-languages-field'
          label={t('common.label.languages')}
          control={
            <LanguageToolControl
              languages={languages}
              addLanguage={addLanguage}
              deleteSelectedLanguage={deleteSelectedLanguage}
              hasSelection={table.getSelectedRowModel().flatRows.length !== 0}
            />
          }
        >
          <Table onKeyDown={onKeyDown} onClick={event => event.stopPropagation()} ref={deleteRef}>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <SelectRow key={row.id} row={row}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </SelectRow>
              ))}
            </TableBody>
          </Table>
        </BasicField>
        <DialogFooter>
          <Button variant='primary' size='large' aria-label={t('common.label.save')} onClick={save}>
            {t('common.label.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
