// 3rd party libs
import React, { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseTable } from 'components';

// Types
import { ColumnConfig, SortClickHandler, SortState } from 'types';
import { ProsealMachineProductionAnalysisAllData } from 'types/proseal';

// Custom hooks
import { useSort } from 'hooks';

// Theme
import theme from 'themes';

// Providers
import { useTimeZone } from 'providers';

const AllDataTableContainer = styled.div`
  table {
    width: 100%;
    table-layout: fixed !important;
  }
`;

function formatLongDate(date: Date, timeZone: string | undefined) {
  return date.toLocaleDateString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    weekday: 'short',
    timeZone
  });
}

const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  timeZone: string | undefined,
  t: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  return [
    {
      title: t('status') as string,
      dataIndex: 'status',
      key: 'status',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'status')
        ? sortState['status']
        : SortState.unsorted,
      render(value) {
        return <>{value}</>;
      }
    },
    {
      title: t('status_category') as string,
      dataIndex: 'statusCategory',
      key: 'statusCategory',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'statusCategory')
        ? sortState['statusCategory']
        : SortState.unsorted,
      render(value) {
        return <>{value}</>;
      }
    },
    {
      title: t('start_time') as string,
      dataIndex: 'startTime',
      key: 'startTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'startTime')
        ? sortState['startTime']
        : SortState.unsorted,
      render(_, data) {
        const rowData = data as ProsealMachineProductionAnalysisAllData;
        return <>{formatLongDate(new Date(rowData.startTime), timeZone)}</>;
      }
    },
    {
      title: t('end_time') as string,
      dataIndex: 'endTime',
      key: 'endTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'endTime')
        ? sortState['endTime']
        : SortState.unsorted,
      render(_, data) {
        const rowData = data as ProsealMachineProductionAnalysisAllData;
        return <>{formatLongDate(new Date(rowData.endTime), timeZone)}</>;
      }
    },
    {
      title: t('duration') as string,
      dataIndex: 'duration',
      key: 'duration',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'duration')
        ? sortState['duration']
        : SortState.unsorted,
      render(value: number) {
        return <>{moment.utc(value * 1000).format('HH:mm:ss')}</>;
      }
    },
    {
      title: t('pack_count') as string,
      dataIndex: 'packCount',
      key: 'packCount',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'packCount')
        ? sortState['packCount']
        : SortState.unsorted,
      render(value) {
        return <>{(value as number).toLocaleString([])}</>;
      }
    },
    {
      title: t('avg_packs_per_minute') as string,
      dataIndex: 'packsPerMinute',
      key: 'packsPerMinute',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'packsPerMinute')
        ? sortState['packsPerMinute']
        : SortState.unsorted,
      render(_, data) {
        const rowData = data as ProsealMachineProductionAnalysisAllData;
        return <>{Math.round(rowData.packCount / (rowData.duration / 60))}</>;
      }
    },
    {
      title: t('recipe') as string,
      dataIndex: 'recipe',
      key: 'recipe',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'recipe')
        ? sortState['recipe']
        : SortState.unsorted,
      render(value) {
        return <>{value}</>;
      }
    },
    {
      title: t('is_production') as string,
      dataIndex: 'isProduction',
      key: 'isProduction',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'isProduction')
        ? sortState['isProduction']
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
    },
    {
      title: t('is_running') as string,
      dataIndex: 'isRunning',
      key: 'isRunning',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'isRunning')
        ? sortState['isRunning']
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
    },
    {
      title: t('is_internal_error') as string,
      dataIndex: 'isInternalError',
      key: 'isInternalError',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'isInternalError')
        ? sortState['isInternalError']
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
    },
    {
      title: t('is_external_error') as string,
      dataIndex: 'isExternalError',
      key: 'isExternalError',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'isExternalError')
        ? sortState['isExternalError']
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

const INITIAL_SORT_STATE = {
  status: SortState.unsorted,
  statusCategory: SortState.unsorted,
  duration: SortState.unsorted,
  recipe: SortState.unsorted,
  startTime: SortState.unsorted,
  endTime: SortState.descending,
  isExternalError: SortState.unsorted,
  isInternalError: SortState.unsorted,
  isProduction: SortState.unsorted,
  isRunning: SortState.unsorted,
  packCount: SortState.unsorted,
  packsPerMinute: SortState.unsorted
};

const CLEAR_SORT_STATE = {
  ...INITIAL_SORT_STATE,
  endTime: SortState.unsorted
};

interface AllDataTableProps {
  rows?: ProsealMachineProductionAnalysisAllData[];
}

const AllDataTable = (props: AllDataTableProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const [sortState, setSortState] = useState<Record<string, SortState>>(INITIAL_SORT_STATE);
  const slicedData = useMemo(() => (props.rows ?? []).slice(1), [props.rows]);
  const sortedData = useSort<ProsealMachineProductionAnalysisAllData>(sortState, slicedData);
  const { timeZone } = useTimeZone();

  const sortHandler = useCallback<SortClickHandler>((key, currentSortState) => {
    let newSortState = SortState.none;
    switch (currentSortState) {
      case SortState.ascending:
        newSortState = SortState.descending;
        break;
      case SortState.descending:
        newSortState = SortState.unsorted;
        break;
      default:
        newSortState = SortState.ascending;
    }

    setSortState({
      ...CLEAR_SORT_STATE,
      [key]: newSortState
    });
  }, []);

  return (
    <AllDataTableContainer>
      <BaseTable
        rowKey="eventId"
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs(sortState, timeZone, t)}
        sortHandler={sortHandler}
        data={sortedData}
        isDataLoading={false}
        borderBottomRow
      />
    </AllDataTableContainer>
  );
};
export default AllDataTable;
