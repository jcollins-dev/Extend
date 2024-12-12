import React from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { TableXSWrapper } from './TableXS.elements';
import { generateTableColumns } from '../utils';

interface TableProps {
  data: Record<string, unknown>[];
  columnSettings: Record<string, unknown>[];
  customClass?: string;
}

export const TableXS = ({ data, columnSettings, customClass }: TableProps): JSX.Element => {
  const table = useReactTable({
    data,
    columns: generateTableColumns(columnSettings),
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  return (
    <TableXSWrapper className={`table-wrapper--small widget-ui-main ${customClass}`}>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </TableXSWrapper>
  );
};
