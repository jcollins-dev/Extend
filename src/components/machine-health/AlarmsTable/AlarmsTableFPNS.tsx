// 3rd party libs
import React, { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseTable } from 'components';

// Types
import { ColumnConfig, SortClickHandler, SortState } from 'types';
import { Alarm } from 'types/machine-health/alarms';

// Helpers
import { getDurationBetweenTimestamps, formatDate } from 'helpers';

// Providers
import { useTimeZone } from 'providers';

// Hooks
import { useSort } from 'hooks';

export interface AlarmTableRow {
  code: string;
  startTimestamp: string;
  endTimestamp: string;
  location?: string;
  description?: string;
  key: string;
  duration: string;
  startDate: string;
}

interface Props {
  data?: Alarm[];
  isLoading?: boolean;
  // Setting scrollheight sets a fixed height and enables vertical scrolling
  scrollHeight?: number;
  rowIcon?: 'arrow'; // TODO: There will be more icon types in future
  onIconClick?: () => void;
  hideAreaColumn?: boolean;
}

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  width: 2.75rem;
  height: 2.75rem;
`;

const BodyRowContainer = styled.tr<{ isActive: boolean }>`
  background-color: ${(props) => {
    if (props.isActive) {
      return props.theme.colors.table.active;
    }

    return 'transparent';
  }} !important; // !important needed to override BaseTable alternatingRowColoring styling
`;

// Instantiate sort state outside of the component
// otherwise we get an infinite loop in the useSort hook
// because the object is a different instance each time
const defaultSortState: Record<string, SortState> = {
  duration: SortState.unsorted,
  id: SortState.unsorted,
  location: SortState.unsorted,
  startDate: SortState.unsorted,
  text: SortState.unsorted,
  type: SortState.unsorted
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  button: React.ReactNode | undefined,
  sortState: Record<string, SortState>,
  t: TFunction<'mh'[], undefined>,
  hideAreaColumn?: boolean
): ColumnConfig[] => {
  const columns = [
    {
      title: t('start_date') as string,
      dataIndex: 'startDate',
      key: 'startDate',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'startDate')
        ? sortState['startDate']
        : SortState.unsorted
    },
    {
      title: t('duration') as string,
      dataIndex: 'duration',
      key: 'duration',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'duration')
        ? sortState['duration']
        : SortState.unsorted
    },
    {
      title: t('Description') as string,
      dataIndex: 'description',
      key: 'description',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'description')
        ? sortState['description']
        : SortState.unsorted
    },
    {
      title: t('id', { ns: 'common' }) as string,
      dataIndex: 'code',
      key: 'code',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'code')
        ? sortState['code']
        : SortState.unsorted
    },
    ...(button
      ? [
          {
            title: '',
            dataIndex: 'button',
            key: 'button',
            render() {
              return {
                props: {
                  // Remove padding to allow larger hit target area for button
                  style: { padding: 0 }
                },
                children: button
              };
            }
          }
        ]
      : [])
  ];

  if (!hideAreaColumn) {
    columns.splice(3, 0, {
      title: t('area') as string,
      dataIndex: 'location',
      key: 'location',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'location')
        ? sortState['location']
        : SortState.unsorted
    });
  }

  return columns;
};

export const AlarmsTableFPNS = ({
  data,
  isLoading,
  scrollHeight,
  rowIcon,
  onIconClick,
  hideAreaColumn
}: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  const theme = useTheme();
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const { t } = useTranslation(['mh']);

  const formattedData: Record<string, unknown>[] = useMemo(
    () =>
      (data ?? []).map((alarm: Record<string, unknown>) => {
        return {
          ...alarm,
          key: `${alarm.startTimestamp}-${alarm.endTimestamp}-${alarm.code}`,
          duration: getDurationBetweenTimestamps(
            alarm?.startTimestamp as string,
            alarm?.endTimestamp as string
          ),
          startDate: formatDate(
            new Date(alarm?.startTimestamp as string),
            'numeric-date-time',
            timeZone
          )
        };
      }),
    [data, timeZone]
  );

  const sortedAlarmsList = useSort(sortState, formattedData);

  // Interaction handler functions
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

  const icon = rowIcon === 'arrow' ? <FontAwesomeIcon icon={faArrowRight} /> : null;

  const button = icon && onIconClick && <IconButton onClick={onIconClick}>{icon}</IconButton>;

  return (
    <BaseTable
      columnConfigs={generateColumnConfigs(button, sortState, t, hideAreaColumn)}
      alternatingRowColoring={false}
      data={sortedAlarmsList}
      borderBottomRow
      isDataLoading={isLoading}
      scroll={scrollHeight ? { y: scrollHeight } : {}}
      outerBorderColor={theme.colors.mediumGrey1}
      bodyRowComponent={BodyRowContainer}
      onRow={(record) => {
        return {
          isActive: !record.endTimestamp
        } as React.HTMLAttributes<AlarmTableRow>;
      }}
      sortHandler={sortHandler}
    />
  );
};
