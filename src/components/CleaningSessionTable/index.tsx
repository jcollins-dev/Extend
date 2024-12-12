// 3rd party libs
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Components
import { BaseTable } from 'components';
import { ColumnConfig } from 'types';
import theme from 'themes';
import { CleaningSession } from 'types/protein';

// Helpers
import { formatDate, getDurationBetweenTimestamps } from 'helpers';

// Providers
import { useTimeZone } from 'providers';

interface Props {
  data?: CleaningSession[];
  onSessionClick: (session: CleaningSession) => void;
  isLoading?: boolean;
  session?: CleaningSession;
}

interface CleaningSessionWithKey extends CleaningSession {
  key: string;
}

// Styling
const TableContainer = styled.div`
  padding: 1rem;
  table > tbody > tr,
  thead > tr {
    height: 4rem;
  }
`;

const CustomHeader = styled.thead`
  * > div {
    cursor: default;
    font-size: 0.8rem;
  }
`;

const CustomRow = styled.tr<{ active?: boolean }>`
  cursor: pointer;

  th {
    font-weight: ${(props) => (props.active ? 'bold' : 500)};
  }

  &:hover th {
    background: ${({ theme }) => theme.colors.lightGrey1};
  }

  th:first-child {
    padding: 0;
  }
  th:last-child {
    padding-right: 0.5rem;
  }
`;

const StatusRenderer = styled.div`
  display: flex;
  justify-content: center;
`;

const InOut = keyframes`
  0% {
    opacity:0;
    transform: scale(0);
  }
  100% {
    opacity:1;
    transform: scale(1);
  }
`;

const CircleRenderer = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.green};
  animation: ${InOut} 1.5s infinite;
`;

const DurationRenderer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const columnConfigs = (timeZone?: string): ColumnConfig[] => [
  {
    title: '',
    dataIndex: 'status',
    key: 'status',
    render(_, data) {
      const { alarms, startTimestamp, endTimestamp } = data as CleaningSession;
      const hasAlarms = alarms > 0;
      const isInProgress = startTimestamp && !endTimestamp;

      const cell: React.ReactNode = {
        children: (
          <StatusRenderer>
            {isInProgress && !hasAlarms && <CircleRenderer />}
            {hasAlarms && <FontAwesomeIcon color={theme.colors.darkGrey} icon={faBell} />}
          </StatusRenderer>
        ),
        props: {
          style: {
            ...(isInProgress && !hasAlarms && { background: theme.colors.onTrackGreen4 }),
            ...(hasAlarms && { background: theme.colors.negativeRed4 })
          }
        }
      };
      return cell;
    },
    width: '0.1rem'
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    render(_, obj) {
      const { startTimestamp } = obj as CleaningSession;
      return startTimestamp
        ? formatDate(new Date(startTimestamp), 'numeric-date-time', timeZone)
        : '-';
    }
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    key: 'endTime',
    render(_, obj) {
      const { endTimestamp } = obj as CleaningSession;
      return endTimestamp ? formatDate(new Date(endTimestamp), 'numeric-date-time', timeZone) : '-';
    }
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
    render(_, data) {
      const { startTimestamp, endTimestamp } = data as CleaningSession;
      return (
        <DurationRenderer>
          {getDurationBetweenTimestamps(startTimestamp, endTimestamp)}
          <FontAwesomeIcon icon={faChevronRight} color={theme.colors.darkGrey} />
        </DurationRenderer>
      );
    }
  }
];

const CleaningSessionTable = ({ data, onSessionClick, isLoading, session }: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  // Add unique keys to the data, as the table requires them
  const dataWithKeys: CleaningSessionWithKey[] = (data ?? []).map((session) => ({
    ...session,
    key: `row-${session.startTimestamp}-${session.endTimestamp}`
  }));

  // Order by date descending
  const orderedData = dataWithKeys.sort((a, b) => {
    const aDate = new Date(a.startTimestamp);
    const bDate = new Date(b.startTimestamp);
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <TableContainer>
      <BaseTable
        columnConfigs={columnConfigs(timeZone)}
        // Pass empty data when loading to make sure table shows a spinner when switching dates
        data={isLoading ? [] : orderedData}
        alternatingRowColoring={false}
        customHeader={CustomHeader}
        // Only use CustomRow when there is data to show
        bodyRowComponent={!isLoading && dataWithKeys.length ? CustomRow : undefined}
        onRow={(record) => {
          return {
            onClick: () => onSessionClick(record),
            active: record.startTimestamp === session?.startTimestamp
          };
        }}
        borderBottomRow
        isDataLoading={isLoading}
      />
    </TableContainer>
  );
};

export default CleaningSessionTable;
