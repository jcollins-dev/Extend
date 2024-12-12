// 3rd party libs
import React, { useState } from 'react';

import { usePressurizeCycleDataById } from '../hooks';

import { BaseType, SortState, ColumnConfig, SortClickHandler } from 'types';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { BaseTable, useDateRange } from 'components';

// Theme
import theme from 'themes';
import { useSort } from 'hooks';

interface PressurizeDataRow extends BaseType {
  systemId: string;
  batchNumber: string;
  lotId: string;
  batchSuccessful: boolean;
  startTime: string;
  endTime: string;
  idealPressurizeTime: string;
  deltaPressurizeTime: string;
  cycleTime: string;
  pressurizeTime: string;
}

export interface PressurizedPerformancePanelProps {
  machineId?: string;
}

const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  t: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  const { timeZone } = useDateRange();

  return [
    {
      title: 'Start Time' as string,
      dataIndex: 'startTime',
      key: 'startTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'startTime')
        ? sortState['startTime']
        : SortState.unsorted,
      render(value) {
        return {
          children: formatInTimeZone(parseISO(value as string), timeZone, `P' - 'p`)
        };
      }
    },
    {
      title: 'Lot ID' as string,
      dataIndex: 'lotId',
      key: 'lotId',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'lotId')
        ? sortState['lotId']
        : SortState.unsorted
    },
    {
      title: 'Batch Number' as string,
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'batchNumber')
        ? sortState['batchNumber']
        : SortState.unsorted
    },
    {
      title: 'Actual Pressurization Time' as string,
      dataIndex: 'pressurizeTime',
      key: 'pressurizeTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'pressurizeTime')
        ? sortState['pressurizeTime']
        : SortState.unsorted,
      render(value: number) {
        return {
          children: `${Math.floor(value)} sec`
        };
      }
    },
    {
      title: 'Target Pressurization Time' as string,
      dataIndex: 'idealPressurizeTime',
      key: 'idealPressurizeTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'idealPressurizeTime')
        ? sortState['idealPressurizeTime']
        : SortState.unsorted,
      render(value: number) {
        return {
          children: `${Math.floor(value)} sec`
        };
      }
    },
    {
      title: 'Pressurization Time Result' as string,
      dataIndex: 'deltaPressurizeTime',
      key: 'deltaPressurizeTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'deltaPressurizeTime')
        ? sortState['deltaPressurizeTime']
        : SortState.unsorted,
      render(value: number) {
        return {
          children: `${Math.floor(value)} sec`
        };
      }
    },
    {
      title: 'Cycle Time' as string,
      dataIndex: 'cycleTime',
      key: 'cycleTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'cycleTime')
        ? sortState['cycleTime']
        : SortState.unsorted,
      render(value: number) {
        return {
          children: `${value} sec`
        };
      }
    },
    {
      title: 'Batch Processed' as string,
      dataIndex: 'batchSuccessful',
      key: 'batchSuccessful',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'batchSuccessful')
        ? sortState['batchSuccessful']
        : SortState.unsorted,
      render(value) {
        return {
          props: {
            style: {
              background: value ? theme.colors.onTrackGreen5 : theme.colors.negativeRed4,
              color: value ? theme.colors.darkGreen : theme.colors.darkRed
            }
          },
          children: value ? t('yes', { ns: 'common' }) : t('no', { ns: 'common' })
        };
      }
    }
  ];
};

const defaultSortState = {
  startTime: SortState.descending,
  endTime: SortState.unsorted,
  systemId: SortState.unsorted,
  batchNumber: SortState.unsorted,
  lotId: SortState.unsorted,
  batchSuccessful: SortState.unsorted,
  idealPressurizeTime: SortState.unsorted,
  deltaPressurizeTime: SortState.unsorted,
  pressurizeTime: SortState.unsorted,
  cycleTime: SortState.unsorted
};

const addKeysToData = (keyPrefix: string, data: PressurizeDataRow[]) => {
  return data.map((item) => {
    if (!item.batchSuccessful) {
      return {
        ...item,
        deltaPressurizeTime: '0',
        key: `${keyPrefix}-${item.id}`
      };
    }

    return {
      ...item,
      key: `${keyPrefix}-${item.id}`
    };
  });
};

export const PressurizationPerformanceTable = ({
  gridArea
}: {
  gridArea?: string;
}): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const { isLoading, tableData } = usePressurizeCycleDataById();
  const sortedData = useSort<PressurizeDataRow>(sortState, tableData as PressurizeDataRow[]);

  const keyPrefix = 'health-data';
  const dataWithKeys: PressurizeDataRow[] = addKeysToData(keyPrefix, sortedData);

  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...defaultSortState,
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };
    setSortState(newSortState);
  };

  return (
    <BaseTable
      rowKey="rowKey"
      columnConfigs={generateColumnConfigs(sortState, t)}
      data={dataWithKeys}
      sortHandler={sortHandler}
      isDataLoading={isLoading}
      scroll={{ y: 350 }}
      borderBottomRow
      alternatingRowColoring={false}
      gridArea={gridArea}
    />
  );
};
