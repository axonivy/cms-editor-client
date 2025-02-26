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
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
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
    data: contentObjects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState
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

  return (
    <Flex direction='column' onClick={() => selectRow(table)} className='cms-editor-main-content'>
      <BasicField label='Content Objects' onClick={event => event.stopPropagation()} className='cms-editor-main-table-field'>
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
