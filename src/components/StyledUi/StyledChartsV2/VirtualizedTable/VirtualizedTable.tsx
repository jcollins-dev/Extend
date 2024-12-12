//3rd party
import React, { useMemo } from 'react';
import { Table, Column, AutoSizer, ColumnProps, TableHeaderProps } from 'react-virtualized';
import { useSortState, sortByKey } from './_helpers/useSortState';
import {
  VirtualizedTableHeaderCellContainer,
  VirtualizedTableContainer
} from './VirtualizedTable.elements';
import { SortStateArrows, useFilterSelected, filterSelectedData } from 'components/StyledUi';

import 'react-virtualized/styles.css';

export type Ref = HTMLDivElement | undefined | null;

export interface VirtualizedTablePropsColumnsConfig extends ColumnProps {
  translateLabel?: string;
  label?: string;
  dataKey: string;
}

export interface VirtualizedTableProps {
  id?: string;
  width?: number;
  height?: number;
  columnsConfig: VirtualizedTablePropsColumnsConfig[];
  rowClassName?: (props: Record<string, unknown>) => string;
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  data?: Record<string, unknown>[];
  defaultSortDirection?: string;
  sortKeys?: Record<string, string>[];
  rowStyler?: (props: Record<string, unknown>) => React.CSSProperties;
}

// setup the custom table headers
const generateTableHeaders = (columnsConfig: VirtualizedTablePropsColumnsConfig[]): JSX.Element[] =>
  columnsConfig.map(({ label, translateLabel, dataKey, ...rest }) => {
    if (!translateLabel && !label) {
      console.log(
        'Error generating table header:  missing label or translateLabel in generateTableHeaders'
      );
      return <></>;
    }
    return (
      <Column
        key={dataKey}
        {...{
          ...rest,
          label,
          dataKey
        }}
      />
    );
  });

export const VirtualizedTable = ({
  columnsConfig,
  data,
  id,
  height,
  rowStyler
}: VirtualizedTableProps): JSX.Element => {
  const [selected] = useFilterSelected();

  const [handleSort, sortKeys] = useSortState([{ dataKey: '', direction: '' }]);

  const HeaderCell = ({ label, dataKey }: TableHeaderProps) => {
    let sorting: string | undefined = undefined;

    if (sortKeys?.[0] && sortKeys?.[0].dataKey === dataKey) sorting = sortKeys?.[0]?.direction;

    return (
      <VirtualizedTableHeaderCellContainer>
        {label}
        <SortStateArrows {...{ sorting }} />
      </VirtualizedTableHeaderCellContainer>
    );
  };

  // add the custom header render to the table headers, this will contain the arrows for sorting states
  columnsConfig = columnsConfig.map((col) => (col = { ...col, headerRenderer: HeaderCell }));

  const cachedFilteredData = useMemo(() => {
    if (data) {
      return filterSelectedData({ data, selected });
    }
  }, [data, selected]);

  const sortedData = sortByKey({ data: cachedFilteredData, sortKeys });

  const TableHeaders = data && generateTableHeaders(columnsConfig);

  if (!cachedFilteredData?.length)
    return <div className="widget-ui-main is-centered">no data within range</div>;

  return (
    <VirtualizedTableContainer className="widget-ui-main no-padding">
      <AutoSizer disableHeight>
        {({ width }) => (
          <>
            <Table
              rowStyle={
                !rowStyler
                  ? undefined
                  : ({ index }) => {
                      const dataItem = sortedData?.[index];
                      if (!dataItem) return {};
                      return rowStyler(dataItem);
                    }
              }
              id={id}
              width={width}
              height={height || 300}
              headerHeight={45}
              rowHeight={45}
              rowCount={sortedData?.length || 0}
              rowGetter={({ index }) => sortedData?.[index]}
              onHeaderClick={({ dataKey }) => handleSort(dataKey)}
            >
              {TableHeaders}
            </Table>
          </>
        )}
      </AutoSizer>
    </VirtualizedTableContainer>
  );
};
