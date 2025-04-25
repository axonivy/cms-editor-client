import type { CmsData, CmsRemoveLocalesArgs } from '@axonivy/cms-editor-protocol';
import {
  BasicField,
  BasicSelect,
  Button,
  deleteFirstSelectedRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey, useQueryKeys } from '../../query/query-client';
import { useKnownHotkeys } from '../../utils/hotkeys';

export const LanguageTool = () => {
  const { context, defaultLanguageTag, setDefaultLanguageTag, languageDisplayName } = useAppContext();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      initializeDialog();
    }
  };

  const [defaultLanguage, setDefaultLanguage] = useState(defaultLanguageTag);
  const [languages, setLanguages] = useState<Array<Language>>([]);

  const deleteSelectedLanguage = () => {
    const { newData } = deleteFirstSelectedRow(table, languages);
    setLanguages(newData);
  };

  const locales = useMeta('meta/locales', context, []).data;

  const initializeDialog = () => {
    setDefaultLanguage(defaultLanguageTag);
    setLanguages(
      locales
        .map(locale => ({ value: locale, label: languageDisplayName.of(locale) ?? locale }))
        .sort((option1, option2) => option1.label.localeCompare(option2.label))
    );
    table.resetRowSelection();
  };

  const selection = useTableSelect();
  const columns: Array<ColumnDef<Language, string>> = [
    {
      accessorKey: 'label',
      cell: cell => <span>{cell.getValue()}</span>
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

  const deleteMutation = useMutation({
    mutationFn: async (args: CmsRemoveLocalesArgs) => {
      queryClient.setQueryData<Array<string>>(genQueryKey('meta/locales', context), locales =>
        locales?.filter(locale => !args.locales.includes(locale))
      );
      if (args.locales.includes(defaultLanguageTag)) {
        queryClient.setQueryData<CmsData>(dataKey({ context, languageTags: [defaultLanguageTag] }), data => {
          if (!data) {
            return;
          }
          return { ...data, data: data.data.map(co => ({ ...co, values: {} })) };
        });
      }
      client.removeLocales({ context, locales: args.locales });
    }
  });

  const save = () => {
    setDefaultLanguageTag(defaultLanguage);
    const localesToDelete = locales.filter(locale => !languages.some(language => language.value === locale));
    if (localesToDelete) {
      deleteMutation.mutate({ context, locales: localesToDelete });
    }
    setOpen(false);
  };

  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.languageTool.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const deleteRef = useHotkeys(hotkeys.deleteLanguage.hotkey, () => deleteSelectedLanguage(), { scopes: ['global'] });
  const enter = useHotkeys(['Enter'], () => save(), { scopes: ['global'], enabled: open, enableOnFormTags: true });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.WsStart} aria-label={hotkeys.languageTool.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{hotkeys.languageTool.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent ref={deleteRef} onClick={() => table.resetRowSelection()}>
        <DialogHeader>
          <DialogTitle>{t('dialog.languageTool.title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('dialog.languageTool.description')}</DialogDescription>
        <Flex direction='column' gap={3} ref={enter}>
          <BasicField label={t('dialog.languageTool.label.defaultLanguage')}>
            <BasicSelect value={defaultLanguage} onValueChange={setDefaultLanguage} items={languages} />
          </BasicField>
          <BasicField
            label={t('common.label.languages')}
            control={
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      icon={IvyIcons.Trash}
                      onClick={event => {
                        deleteSelectedLanguage();
                        event.stopPropagation();
                      }}
                      disabled={table.getSelectedRowModel().flatRows.length === 0}
                      aria-label={hotkeys.deleteLanguage.label}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{hotkeys.deleteLanguage.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
          >
            <Table onKeyDown={handleKeyDown} onClick={event => event.stopPropagation()}>
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
        </Flex>
        <DialogFooter>
          <Button variant='primary' size='large' aria-label={t('common.label.save')} onClick={save}>
            {t('common.label.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type Language = {
  value: string;
  label: string;
};
