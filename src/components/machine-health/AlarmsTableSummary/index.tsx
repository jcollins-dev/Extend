// 3rd party libs
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseTable } from 'components';

// Types
import { ColumnConfig, SortClickHandler, SortState } from 'types';
import { AlarmSummary } from 'types/machine-health/alarms';

// Hooks
import { useSort } from 'hooks';

// Helpers
import { formatDuration } from 'helpers';

export interface AlarmTableRow extends AlarmSummary {
  key: string;
  duration: string;
  startDate: string;
}

interface Props {
  data?: AlarmSummary[];
  isLoading?: boolean;
  // Setting scrollheight sets a fixed height and enables vertical scrolling
  scrollHeight?: number;
  rowIcon?: 'arrow'; // TODO: There will be more icon types in future
  onIconClick?: () => void;
}

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  width: 2.75rem;
  height: 2.75rem;
`;

// Instantiate sort state outside of the component
// otherwise we get an infinite loop in the useSort hook
// because the object is a different instance each time
const defaultSortState: Record<string, SortState> = {
  duration: SortState.descending,
  count: SortState.unsorted,
  id: SortState.unsorted,
  text: SortState.unsorted
  //type: SortState.unsorted
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  button: React.ReactNode | undefined,
  sortState: Record<string, SortState>,
  t: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  return [
    {
      title: t('id', { ns: 'common' }) as string,
      dataIndex: 'code',
      key: 'code',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'code')
        ? sortState['code']
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
      title: t('duration') as string,
      dataIndex: 'totalTime',
      key: 'totalTime',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'totalTime')
        ? sortState['type']
        : SortState.unsorted,
      render(value) {
        const durationAsMillis = value as number;
        const duration = formatDuration(durationAsMillis, 'hours:mins:secs');
        return <>{duration}</>;
      }
    },
    {
      title: t('count') as string,
      dataIndex: 'count',
      key: 'count',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'count')
        ? sortState['type']
        : SortState.unsorted,
      render(value) {
        return <>{value}</>;
      }
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
};

const AlarmsTableSummary = ({
  data,
  isLoading,
  scrollHeight,
  rowIcon,
  onIconClick
}: Props): JSX.Element => {
  const theme = useTheme();
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const { t } = useTranslation(['mh']);

  const sortedAlarmsList = useSort(sortState, data);

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
      columnConfigs={generateColumnConfigs(button, sortState, t)}
      alternatingRowColoring={false}
      data={sortedAlarmsList}
      borderBottomRow
      isDataLoading={isLoading}
      scroll={scrollHeight ? { y: scrollHeight } : {}}
      outerBorderColor={theme.colors.mediumGrey1}
      sortHandler={sortHandler}
    />
  );
};

export default AlarmsTableSummary;
