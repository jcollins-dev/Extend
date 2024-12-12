// 3rd party libs
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { BaseTable } from 'components';

// Types
import { SortClickHandler, SortState } from 'types';
import { LineStatus, MachineLineStatus, SiteTableType } from 'types/protein';
import { BusinessUnit, SiteTableDataType } from 'types/dsi';

// Hooks
import { useSort } from 'hooks';

// Utils
import { addKeyProp, CustomHeader, generateColumnConfigs } from './utils';
import { DataRenderer } from 'components/machine-health';

// Api
import { useGetLineStatusQuery, useGetMachineStatusQuery } from 'api';

interface Props {
  plantId: string;
  type: SiteTableType;
  tableData?: { tableType: SiteTableDataType; tableData: MachineLineStatus[] };
  isTableDataLoading?: boolean;
  businessUnit?: BusinessUnit;
  className?: string;
}

export const initSortState = (type: SiteTableType): Record<string, SortState> => {
  return type == 'MACHINE'
    ? { machine: SortState.unsorted, status: SortState.unsorted }
    : { machine: SortState.unsorted };
};

const initSiteTableData = (
  type: SiteTableType,
  lines: LineStatus[] | undefined,
  machines: MachineLineStatus[] | undefined
) => (type == 'LINE' ? lines : machines);

const SiteTable = ({
  plantId,
  type,
  tableData,
  isTableDataLoading,
  businessUnit,
  className
}: Props): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation(['mh']);

  /**
   * Query site lines
   */
  const {
    data: lines,
    isLoading: linesLoading,
    error: linesError
  } = useGetLineStatusQuery({ plantId }, { skip: !plantId, pollingInterval: 30000 });
  /**
   * Query site machines
   */
  const {
    data: machines,
    isLoading: machinesLoading,
    error: machinesError
  } = useGetMachineStatusQuery(
    { plantId, businessUnit },
    { skip: !plantId, pollingInterval: 30000 }
  );

  const [sortState, setSortState] = useState<Record<string, SortState>>(initSortState(type));

  const sortedData = useSort<LineStatus | MachineLineStatus>(
    sortState,
    initSiteTableData(type, lines, tableData ? tableData.tableData : machines)
  );

  const sortHandler: SortClickHandler = (key, currentSortState) => {
    setSortState({
      ...initSortState(type),
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    });
  };

  const goto = (path: string) => {
    history.push(path);
  };

  const isLoading =
    (type == 'MACHINE' ? machinesLoading : linesLoading) || (isTableDataLoading ?? false);
  const error = type == 'MACHINE' ? machinesError : linesError;

  return (
    <DataRenderer isLoading={isLoading} error={error && 'Failed to load data'}>
      <BaseTable
        customHeader={CustomHeader}
        columnConfigs={generateColumnConfigs(
          type,
          sortState,
          goto,
          t,
          tableData && tableData.tableType,
          businessUnit
        )}
        sortHandler={sortHandler}
        alternatingRowColoring={false}
        data={addKeyProp(sortedData, type)}
        borderBottomRow
        outerBorderColor={theme.colors.mediumGrey1}
        className={className}
      />
    </DataRenderer>
  );
};

export default SiteTable;
