import { type ContentObject } from '@axonivy/cms-editor-protocol';
import {
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
  useTableGlobalFilter,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useKnownHotkeys } from '../utils/hotkeys';
import './MainContent.css';

export const MainContent = () => {
  const { contentObjects, setSelectedContentObject, detail, setDetail } = useAppContext();

  const selection = useTableSelect<ContentObject>({
    onSelect: selectedRows => {
      const selectedRowId = Object.keys(selectedRows).find(key => selectedRows[key]);
      const selectedContentObject = table.getRowModel().flatRows.find(row => row.id === selectedRowId)?.index;
      setSelectedContentObject(selectedContentObject);
    }
  });

  const sort = useTableSort();

  const globalFilter = useTableGlobalFilter();

  const columns: Array<ColumnDef<ContentObject, string>> = [
    {
      accessorKey: 'uri',
      header: ({ column }) => <SortableHeader column={column} name='URI' />,
      cell: cell => <span>{cell.getValue()}</span>
    }
  ];

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
      ...globalFilter.tableState
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

  return (
    <Flex direction='column' onClick={() => selectRow(table)} className='cms-editor-main-content'>
      <BasicField
        label='Content Objects'
        tabIndex={-1}
        ref={firstElement}
        onClick={event => event.stopPropagation()}
        className='cms-editor-main-table-field'
      >
        {globalFilter.filter}
        <div ref={tableContainer} className='cms-editor-main-table-container'>
          <Table onKeyDown={event => handleKeyDown(event, () => setDetail(!detail))} className='cms-editor-main-table'>
            <TableResizableHeader
              headerGroups={table.getHeaderGroups()}
              onClick={() => selectRow(table)}
              className='cms-editor-main-table-header-row'
            />
            <TableBody style={{ height: `${virtualizer.getTotalSize()}px` }} className='cms-editor-main-table-body'>
              {virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <SelectRow key={row.id} row={row} style={{ transform: `translateY(${virtualRow.start}px)` }}>
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
