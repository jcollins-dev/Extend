import React from 'react';

// TanStack Libraries
import {
  CellContext,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtual } from 'react-virtual';
import { BaseType, TableColumnConfigs } from 'types';

import { createColumnHelper, getFilteredRowModel } from '@tanstack/react-table';
import {
  MasterTagListColumn,
  TagListRowStatus,
  WipMasterTagListAttributeDsdm,
  WipMasterTagListAttributeKdm,
  WipMasterTagListAttributeMqtt,
  WipTagListRowData
} from 'types/machine-management';
import Loader from 'components/Loader';
import styled from 'styled-components';
import {
  NewStyledTable,
  TableContainer,
  TableData,
  TableHead,
  TableHeading
} from './index.elements';
import { hasAllRequiredData } from 'pages/MasterTagListDashBoard';

const FETCH_SIZE = 25;

type RowDataResponse = {
  data:
    | WipMasterTagListAttributeDsdm[]
    | WipMasterTagListAttributeKdm[]
    | WipMasterTagListAttributeMqtt[];
  meta: {
    totalRowCount: number;
  };
};
const LoaderContainer = styled.div`
  width: calc(100vw - 16.32rem);
`;
export interface ColumnConfig extends BaseType {
  id: string;
  header: string;
  isEnableSorting: boolean;
  isSelected: boolean;
  renderer: (cellValue: CellContext<TableColumnConfigs, string>) => JSX.Element | React.ReactNode;
}

const columnHelper = createColumnHelper<TableColumnConfigs>();

export function NewMasterTagListTable({
  rowData,
  columnConfigs,
  globalFilter,
  setGlobalFilter
}: {
  rowData:
    | WipMasterTagListAttributeDsdm[]
    | WipMasterTagListAttributeKdm[]
    | WipMasterTagListAttributeMqtt[];
  columnConfigs: ColumnConfig[];
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const searchableCol = ['master_tag_name', 'description'];
  const columns = columnConfigs.map((columnConfig) =>
    columnHelper.accessor(columnConfig?.id, {
      id: columnConfig.id,
      header: () => columnConfig.header,
      cell: (info: CellContext<TableColumnConfigs, string>) => (
        <span style={{ marginLeft: '0' }}>{columnConfig.renderer(info)}</span>
      ),
      enableSorting: columnConfig.isEnableSorting,
      enableGlobalFilter: searchableCol.includes(columnConfig.id)
    })
  );

  // get row data
  const fetchData = (
    start: number,
    size: number
  ): {
    data:
      | WipMasterTagListAttributeDsdm[]
      | WipMasterTagListAttributeKdm[]
      | WipMasterTagListAttributeMqtt[];
    meta: {
      totalRowCount: number;
    };
  } => {
    const dbData = [...rowData];
    return {
      data: dbData.slice(start, start + size),
      meta: {
        totalRowCount: dbData.length
      }
    };
  };

  //react-query has an useInfiniteQuery hook just for this situation!
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<RowDataResponse>(
    ['table-data', sorting, globalFilter, rowData], //adding sorting state as key causes table to reset and fetch from new beginning upon sort

    async ({ pageParam = 0 }) => {
      const start = pageParam * FETCH_SIZE;
      const fetchedData = fetchData(start, FETCH_SIZE); // fetch row data
      return fetchedData;
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (
        tagListData: WipTagListRowData[],
        columnList: MasterTagListColumn[],
        column: {
          value: string;
          name: string;
          parentRow: number;
        }
      ) => {
        const copyTagListData: WipTagListRowData[] = tagListData
          ? [...tagListData]
          : [
              {
                row: column.parentRow,
                rowStatus: TagListRowStatus.Draft,
                data: {},
                imported: false
              }
            ];
        copyTagListData.forEach((tag) => {
          if (tag.row === column.parentRow) {
            tag.data = {
              ...tag.data,
              [column.name]: column.value
            };
            // when data changes, update this row status according to new data
            tag.rowStatus = hasAllRequiredData([tag], columnList)
              ? TagListRowStatus.Valid
              : TagListRowStatus.Error;
          } else {
            tag.data = {
              ...tag.data
            };
          }
        });
      }
    }
  });

  const { rows } = table.getRowModel();

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <TableContainer
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
      >
        <NewStyledTable>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHeading
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler()
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽'
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHeading>
                  );
                })}
              </tr>
            ))}
          </TableHead>
          <p style={{ visibility: 'hidden', height: '0', margin: '0' }}>
            {isFetching
              ? (document.body.style.overflow = 'hidden')
              : (document.body.style.overflow = 'auto')}
          </p>
          {isFetching ? (
            <LoaderContainer style={{ display: 'flex', justifyContent: 'center' }}>
              <Loader />
            </LoaderContainer>
          ) : (
            <tbody>
              {paddingTop > 0 && (
                <tr>
                  <TableData style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<
                  | WipMasterTagListAttributeDsdm
                  | WipMasterTagListAttributeKdm
                  | WipMasterTagListAttributeMqtt
                >;
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableData key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableData>
                      );
                    })}
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <TableData style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          )}
        </NewStyledTable>
      </TableContainer>
      <div style={{ textAlign: 'left', margin: '0.5rem 0' }}>
        {globalFilter.length > 0 ? `` : `Showing ${flatData.length} of ${totalDBRowCount} Rows`}
      </div>
    </div>
  );
}

export default NewMasterTagListTable;
