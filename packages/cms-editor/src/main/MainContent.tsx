import { type CmsData, type CmsDeleteArgs, type ContentObject } from '@axonivy/cms-editor-protocol';
import {
  adjustSelectionAfterDeletionOfRow,
  BasicField,
  Flex,
  SelectRow,
  selectRow,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  useHotkeys,
  useReadonly,
  useTableGlobalFilter,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../protocol/ClientContextProvider';
import { useQueryKeys } from '../query/query-client';
import { useKnownHotkeys } from '../utils/hotkeys';
import './MainContent.css';
import { MainControl } from './control/MainControl';
import { toLanguages } from './control/language-tool/language-utils';

export const MainContent = () => {
  const { t } = useTranslation();
  const {
    context,
    contentObjects,
    selectedContentObject,
    setSelectedContentObject,
    detail,
    setDetail,
    defaultLanguageTags,
    languageDisplayName
  } = useAppContext();

  const selection = useTableSelect<ContentObject>({
    onSelect: selectedRows => {
      const selectedRowId = Object.keys(selectedRows).find(key => selectedRows[key]);
      const selectedContentObject = table.getRowModel().flatRows.find(row => row.id === selectedRowId)?.index;
      setSelectedContentObject(selectedContentObject);
    }
  });

  const sort = useTableSort();

  const globalFilter = useTableGlobalFilter();

  const columns = useMemo(() => {
    const columns: Array<ColumnDef<ContentObject, string>> = [
      {
        accessorKey: 'uri',
        header: ({ column }) => <SortableHeader column={column} name='URI' />,
        cell: cell => <span>{cell.getValue()}</span>,
        minSize: 200,
        size: 500,
        maxSize: 1000
      }
    ];
    toLanguages(defaultLanguageTags, languageDisplayName).forEach(language =>
      columns.push({
        id: language.value,
        accessorFn: co => co.values[language.value] ?? '',
        header: ({ column }) => <SortableHeader column={column} name={language.label} />,
        cell: cell => <span>{cell.getValue()}</span>,
        minSize: 200,
        size: 500,
        maxSize: 1000
      })
    );
    return columns;
  }, [defaultLanguageTags, languageDisplayName]);

  const table = useReactTable({
    ...selection.options,
    ...sort.options,
    ...globalFilter.options,
    data: contentObjects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn,
    state: {
      ...selection.tableState,
      ...sort.tableState,
      ...globalFilter.tableState,
      rowSelection: { [String(selectedContentObject)]: true }
    }
  });

  const rows = table.getRowModel().rows;
  const tableContainer = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 32,
    getScrollElement: () => tableContainer.current,
    overscan: 20
  });

  const { handleKeyDown } = useTableKeyHandler({ table, data: contentObjects });

  const hotkeys = useKnownHotkeys();

  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  const readonly = useReadonly();

  const client = useClient();
  const queryClient = useQueryClient();
  const { dataKey } = useQueryKeys();

  const { mutate } = useMutation({
    mutationFn: async (args: CmsDeleteArgs) => {
      const data = queryClient.setQueryData<CmsData>(dataKey({ context, languageTags: defaultLanguageTags }), data => {
        if (!data) {
          return;
        }
        return { ...data, data: data.data.filter(co => co.uri !== args.uri) };
      });
      if (data !== undefined && selectedContentObject !== undefined) {
        const contentObjects = data?.data.filter(co => co.type !== 'FOLDER');
        const selection = adjustSelectionAfterDeletionOfRow(contentObjects, table, selectedContentObject);
        setSelectedContentObject(selection);
      }
      client.delete(args);
    }
  });

  const deleteContentObject = () => {
    if (selectedContentObject === undefined) {
      return;
    }
    const uri = contentObjects[selectedContentObject]?.uri;
    if (uri === undefined) {
      return;
    }
    mutate({ context, uri });
  };

  const ref = useHotkeys(hotkeys.deleteContentObject.hotkey, () => deleteContentObject(), { scopes: ['global'], enabled: !readonly });

  return (
    <Flex direction='column' onClick={() => table.resetRowSelection()} className='cms-editor-main-content' ref={ref}>
      <BasicField
        label={t('label.contentObjects')}
        control={
          !readonly && (
            <MainControl
              selectRow={(rowId: string) => selectRow(table, rowId)}
              deleteContentObject={deleteContentObject}
              hasSelection={table.getSelectedRowModel().flatRows.length !== 0}
            />
          )
        }
        tabIndex={-1}
        ref={firstElement}
        onClick={event => event.stopPropagation()}
        className='cms-editor-main-table-field'
      >
        {globalFilter.filter}
        <div ref={tableContainer} className='cms-editor-main-table-container'>
          <Table onKeyDown={event => handleKeyDown(event, () => setDetail(!detail))} className='cms-editor-main-table'>
            <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.resetRowSelection()} />
            <TableBody style={{ height: `${virtualizer.getTotalSize()}px` }}>
              {virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                if (row === undefined) {
                  return null;
                }
                return (
                  <SelectRow key={row.id} row={row} style={{ transform: `translateY(${virtualRow.start}px)` }} vindex={virtualRow.index}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </SelectRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </BasicField>
    </Flex>
  );
};

export const globalFilterFn = (row: Row<ContentObject>, _columnId: string, filterValue: string) => {
  filterValue = filterValue.toLowerCase();
  if (row.original.uri.toLowerCase().includes(filterValue)) {
    return true;
  }
  return Object.values(row.original.values).some(value => value.toLowerCase().includes(filterValue));
};
