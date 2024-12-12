import { BaseTable } from 'components';
import React, { useCallback, useMemo, useState } from 'react';
import { ColumnConfig, SortClickHandler, SortState } from 'types';
import { first, upperFirst } from 'lodash';
import moment from 'moment';
import { useSort } from 'hooks';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { DowntimeTablePercentageBar } from './DowntimeTablePercentageBar';
import styled from 'styled-components';
import { themeColors } from 'themes';
import { DowntimeRow } from 'types/proseal';
import { DowntimeTableShowAllRow } from './DowntimeTableShowAllRow';

const MAX_TABLE_COUNT_COLLAPSED = 4;

const DowntimeTableContainer = styled.div<{ showBar?: boolean; barColor?: string }>`
  table {
    width: 100%;
    table-layout: fixed !important;
  }

  tr:nth-child(n + 2) {
    background-color: ${themeColors.lightGrey1} !important;
    text-indent: 0.5em;
  }

  tr:nth-child(n + 2):nth-child(-n + 5) {
    th:nth-child(1) {
      border-left: ${(props) =>
        props?.showBar ? `0.33rem ${props.barColor ?? 'black'} solid !important` : ''};
    }
  }
`;

const SubHeader = styled.div`
  color: ${themeColors.mediumGrey1};
`;

const INITIAL_SORT_STATE = {
  totalTime: SortState.descending,
  productionTime: SortState.unsorted,
  count: SortState.unsorted
};

const CLEAR_SORT_STATE = {
  ...INITIAL_SORT_STATE,
  totalTime: SortState.unsorted
};

type DowntimeTableProps = {
  data: DowntimeRow[];
  downtimeSubheader?: string;
  enableShowAll?: boolean;
};

const DowntimeTable = (props: DowntimeTableProps): JSX.Element => {
  const [sortState, setSortState] = useState<Record<string, SortState>>(INITIAL_SORT_STATE);
  const [collapsed, setCollapsed] = useState<boolean>(props.enableShowAll ?? false);
  const { t } = useTranslation(['mh']);

  const generateColumnConfigs = (
    sortState: Record<string, SortState>,
    overall: DowntimeRow,
    t: TFunction<'mh'[], undefined>,
    downtimeSubheader?: string
  ): ColumnConfig[] => {
    return [
      {
        title: (
          <div>
            {t('downtime')}
            <SubHeader>{downtimeSubheader}</SubHeader>
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        sortState: SortState.none,
        render(value) {
          return <>{upperFirst((value as string).toLowerCase())}</>;
        }
      },
      {
        title: t('total_time') as string,
        dataIndex: 'totalTime',
        key: 'totalTime',
        sortState: Object.prototype.hasOwnProperty.call(sortState, 'totalTime')
          ? sortState['totalTime']
          : SortState.unsorted,
        render(value) {
          const duration = moment.duration(value as number, 'seconds');
          const durationString =
            duration.hours() >= 1
              ? `${duration.hours()} h ${duration.minutes()} m ${duration.seconds()} s`
              : `${duration.minutes()} m ${duration.seconds()} s`;

          const percentage = ((value as number) / overall.totalTime) * 90;

          return <DowntimeTablePercentageBar value={durationString} percentage={percentage} />;
        }
      },
      {
        title: t('share_of_production_time') as string,
        dataIndex: 'productionShare',
        key: 'productionShare',
        sortState: Object.prototype.hasOwnProperty.call(sortState, 'productionShare')
          ? sortState['productionShare']
          : SortState.unsorted,
        render(value) {
          const percentage = ((value as number) / overall.productionShare) * 90;
          return (
            <DowntimeTablePercentageBar
              value={`${(value as number).toFixed(1)}%`}
              percentage={percentage}
            />
          );
        }
      },
      {
        title: t('count') as string,
        dataIndex: 'count',
        key: 'count',
        sortState: Object.prototype.hasOwnProperty.call(sortState, 'count')
          ? sortState['count']
          : SortState.unsorted,
        render(value) {
          const percentageValue = ((value as number) / overall.count) * 90;
          return <DowntimeTablePercentageBar value={value} percentage={percentageValue} />;
        }
      }
    ];
  };

  const overall = useMemo(() => {
    return (
      first(props.data) ?? {
        name: 'overall',
        totalTime: 1,
        productionShare: 1,
        count: 1
      }
    );
  }, [props.data]);

  const sliceEnd = collapsed ? MAX_TABLE_COUNT_COLLAPSED : props.data.length;

  const slicedData = useMemo(() => {
    return (props.data ?? []).slice(1);
  }, [props.data, collapsed]);

  const sortedData = useSort<DowntimeRow>(sortState, slicedData);

  const truncatedData = useMemo(() => {
    return sortedData.slice(0, sliceEnd);
  }, [sortedData, collapsed]);

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
    <DowntimeTableContainer showBar={props.enableShowAll} barColor={themeColors.onTrackGreen}>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs(sortState, overall, t, props.downtimeSubheader)}
        sortHandler={sortHandler}
        data={[overall, ...truncatedData]}
        rowKey={(record) => `${record.name}`}
        borderBottomRow
        renderCustomFooter={() => {
          return (
            !!props.enableShowAll && (
              <DowntimeTableShowAllRow
                displayText={
                  collapsed ? t('show_more', { item: props.data.length - 1 }) : t('show_less')
                } //offset count by 1 to account for summary row
                onClick={() => setCollapsed(!collapsed)}
              />
            )
          );
        }}
      />
    </DowntimeTableContainer>
  );
};

export default DowntimeTable;
