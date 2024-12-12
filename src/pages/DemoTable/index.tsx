// 3rd party libraries
import React, { HTMLProps } from 'react';
import { default as theme } from 'themes';

import styled from 'styled-components';

import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender
} from '@tanstack/react-table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { StyledRootContainer } from 'components';
import { data } from './demoData';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
};

const StyledTable = styled.table`
  margin: 2rem;
  width: -webkit-fill-available;
  text-align: center;
  overflow: hidden;
  border-collapse: collapse;
  font-size: 0.8125rem;

  thead {
    th {
      border-bottom: 0.0625rem solid #dadada;
      padding: 0.5rem 0rem;
      text-transform: capitalize;
      div {
        float: left;
        margin-left: 1.125rem;
      }
    }
    .select-none,
    .disabled-sort {
      display: flex;
      justify-content: center;
      float: left;
      margin-left: 1rem;
    }
    .disabled-sort div {
      visibility: hidden;
    }
  }

  /* Apply alternate row coloring + optional borders */
  tbody {
    td {
      border-bottom: 0.0625rem solid #f3f2f1;
      padding: 0.5rem 1.5rem;
      text-align: left;
      div {
        float: left;
        margin-left: 1.125rem;
      }
    }

    tr:last-child {
      border-bottom: none;
      background-color: transparent;
      & th {
        border-bottom: none;
      }
    }
  }
`;

const DemoTable = (): React.ReactElement => {
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: () => 'First Name',
        cell: ({ row, getValue }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`
            }}
          >
            <>
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />{' '}
              {row.getCanExpand() ? (
                <div
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' }
                  }}
                >
                  {row.getIsExpanded() ? (
                    <FontAwesomeIcon icon={faChevronDown} color={theme.colors.darkGrey} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronRight} color={theme.colors.darkGrey} />
                  )}
                </div>
              ) : (
                ''
              )}
              &nbsp;&nbsp;&nbsp;
              {getValue()}
            </>
          </div>
        )
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: () => 'Last Name',
        cell: (info) => info.getValue()
      },
      {
        accessorKey: 'age',
        header: () => 'Age'
      },

      {
        accessorKey: 'visits',
        header: () => 'Visits'
      },
      {
        accessorKey: 'status',
        header: () => 'Status'
      },
      {
        accessorKey: 'progress',
        header: () => 'Profile Progress'
      }
    ],
    []
  );

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true
  });

  return (
    <StyledRootContainer>
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </StyledRootContainer>
  );
};

const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current !== null) {
      ref.current.indeterminate = !rest?.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <div>
      <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />
    </div>
  );
};

export default DemoTable;
