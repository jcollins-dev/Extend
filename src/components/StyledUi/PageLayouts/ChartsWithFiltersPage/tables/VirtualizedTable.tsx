//3rd party
import React, { useState, useMemo } from 'react';
import { Table, Column, AutoSizer } from 'react-virtualized';
import { sortByKey } from '../helpers/processAlarmsData';
import 'react-virtualized/styles.css';
import { VirtualizedTableHeaderCellContainer } from './VirtualizedTable.elements';
// Components
import { WidgetUi } from 'components/StyledUi/WidgetUi';
import { SortStateArrows } from 'components/StyledUi/SortStateArrows';
import { useFilterSelected } from 'components/StyledUi/FilterSelected';
import { filterSelectedData } from 'components/StyledUi/FilterSelected';
import { ColumnProps, TableHeaderProps } from 'react-virtualized';
import { VirtualizedTableContainer } from './VirtualizedTable.elements';
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
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  data?: Record<string, unknown>[];
  defaultSortDirection?: string;
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
  defaultSortDirection,
  columnsConfig,
  data,
  isLoading,
  hasError,
  hasMessage,
  id,
  height
}: VirtualizedTableProps): JSX.Element => {
  const [selected] = useFilterSelected();

  const [sort, setSort] = useState<{ sortKey?: string; direction: string }>({
    sortKey: columnsConfig[0].dataKey,
    direction: defaultSortDirection || 'down'
  });

  //console.log({ sort });

  const HeaderCell = ({ label, dataKey }: TableHeaderProps) => {
    const { sortKey, direction } = sort;
    const sorting = sortKey === dataKey ? direction : undefined;

    return (
      <VirtualizedTableHeaderCellContainer>
        {label}
        <SortStateArrows {...{ sorting }} />
      </VirtualizedTableHeaderCellContainer>
    );
  };

  // add the custom header render to the table headers, this will contain the arrows for sorting states
  columnsConfig = columnsConfig.map((col) => (col = { ...col, headerRenderer: HeaderCell }));

  //const { data, isLoading, hasError, hasMessage } = useData();

  const cachedFilteredData = useMemo(() => {
    if (data) {
      return filterSelectedData({ data, selected });
    }
  }, [data, selected]);

  const sortedData = sortByKey({ data: cachedFilteredData, ...sort });

  const TableHeaders = data && generateTableHeaders(columnsConfig);

  if (isLoading || hasError || hasMessage) return <>loading</>;
  if (!cachedFilteredData) return <></>;

  const sortToggler = (dataKey: string) => {
    const { sortKey, direction } = sort;
    const isSorting = sortKey === dataKey ? true : false;
    const newDirection = isSorting && direction === 'up' ? 'down' : 'up';
    setSort({
      sortKey: dataKey,
      direction: newDirection as string
    });
  };

  const widgetMainSettings = { isLoading, hasError, hasMessage };
  return (
    <WidgetUi
      {...widgetMainSettings}
      Main={
        <VirtualizedTableContainer className="widget-ui-main">
          <AutoSizer disableHeight>
            {({ width }) => (
              <>
                <Table
                  id={id}
                  width={width}
                  height={height || 300}
                  headerHeight={35}
                  rowHeight={35}
                  rowCount={sortedData?.length || 0}
                  rowGetter={({ index }) => sortedData?.[index]}
                  onHeaderClick={({ dataKey }) => sortToggler(dataKey)}
                >
                  {TableHeaders}
                </Table>
              </>
            )}
          </AutoSizer>
        </VirtualizedTableContainer>
      }
    />
  );
};
