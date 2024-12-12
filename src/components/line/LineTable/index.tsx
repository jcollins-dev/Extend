// 3rd party libs
import React, { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { BaseTable } from 'components';

// Types
import { SortClickHandler, SortState } from 'types';
import { LineRouteQueryParams, MachineLineStatus, MachineUtilization } from 'types/protein';

// Hooks
import { useSort } from 'hooks';

// Utils
import { addKeyProp, generateColumnConfigs } from './utils';
import { DataRenderer } from 'components/machine-health';

// Api
import { useGetLineMachinesStatusQuery } from 'api';

// Styling
export const CustomHeader = styled.thead(({ theme }) => ({
  tr: {
    background: theme.colors.lightGrey1,
    th: {
      fontSize: '0.8125rem',
      fontWeight: 'bold',
      lineHeight: theme.typography.components.tableHeader.lineHeight,
      bordeBottom: theme.colors.borders.border02.border,
      padding: '0.75rem',
      height: '3.625rem',
      ':first-child': {
        borderTopLeftRadius: '0.5rem'
      },
      ':last-child': {
        borderTopRightRadius: '0.5rem'
      }
    }
  }
}));

export const initSortState: Record<string, SortState> = {
  machine: SortState.unsorted
};

interface Props {
  utilizationByMachine: { id: string; utilization: MachineUtilization }[];
}

const LineTable = ({ utilizationByMachine }: Props): JSX.Element => {
  const { lineId } = useParams<LineRouteQueryParams>();
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation(['mh']);

  /**
   * Query line machines
   */
  const {
    data: machines,
    isLoading,
    error
  } = useGetLineMachinesStatusQuery({ lineId }, { skip: !lineId, pollingInterval: 30000 });

  const machinesWithUtilization = useMemo(
    () =>
      machines?.map((machine) => {
        const machineUtilization = utilizationByMachine.find(
          (utilization) => utilization.id === machine.id
        );
        return {
          ...machine,
          ...machineUtilization?.utilization
        };
      }),
    [machines, utilizationByMachine]
  );

  const [sortState, setSortState] = useState<Record<string, SortState>>(initSortState);
  const sortedData = useSort<MachineLineStatus>(sortState, machinesWithUtilization);

  const sortHandler: SortClickHandler = (key, currentSortState) => {
    setSortState({
      ...initSortState,
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

  return (
    <DataRenderer isLoading={isLoading} error={error && 'Failed to load machine list'}>
      <BaseTable
        customHeader={CustomHeader}
        columnConfigs={generateColumnConfigs(sortState, goto, t)}
        sortHandler={sortHandler}
        alternatingRowColoring={false}
        data={addKeyProp(sortedData)}
        borderBottomRow
        outerBorderColor={theme.colors.mediumGrey1}
      />
    </DataRenderer>
  );
};

export default LineTable;
