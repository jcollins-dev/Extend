// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import { Button, Loader, Pagination, PermissionWrapper } from 'components';
import {
  SortableColumn,
  MaintenanceScheduleTableQuery
} from 'components/MaintenanceTable/MaintenanceTable';

// Types
import { Machine, SortState, UserScopes } from 'types';
import {
  MaintenanceSchedule,
  MaintenanceScheduleArgs,
  MaintenanceScheduleTableRow
} from 'types/maintenance';
import { PermissionScopeName } from 'types/user-management';

// Helpers
import { addMachineDescToSchedule } from './MaintenanceServiceDashboardContents';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetMaintenanceScheduleQuery } from 'api';
import styled from 'styled-components';

// Hooks
import { usePaginatedQueryOffset, useSort } from 'hooks';

// Constants
import { PAGE_LENGTH } from 'constants/search';

const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;
const MaintenanceScheduleTableQueryHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  & button {
    background-color: white;
    border: 0px;
    box-shadow: none;
  }
`;

const mark_all_complete = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_146_80952)">
      <path
        d="M6 10C6 10.5304 6.21071 11.0391 6.58579 11.4142C6.96086 11.7893 7.46957 12 8 12C8.53043 12 9.03914 11.7893 9.41421 11.4142C9.78929 11.0391 10 10.5304 10 10C10 9.46957 9.78929 8.96086 9.41421 8.58579C9.03914 8.21071 8.53043 8 8 8C7.46957 8 6.96086 8.21071 6.58579 8.58579C6.21071 8.96086 6 9.46957 6 10Z"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66669 4.66663H9.33335"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66669 12V14.6667L8.00002 14L9.33335 14.6667V12"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66667 12.6667H5.33333C4.97971 12.6667 4.64057 12.5262 4.39052 12.2761C4.14048 12.0261 4 11.687 4 11.3333V3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V11.3333C12 11.687 11.8595 12.0261 11.6095 12.2761C11.3594 12.5262 11.0203 12.6667 10.6667 12.6667H9.33333"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_146_80952">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
const formatSchedulesIntoRows = (data: MaintenanceSchedule[]): MaintenanceScheduleTableRow[] =>
  data.map(
    (item) =>
      ({
        ...item
        // TODO - connect this to the next task
      } as MaintenanceScheduleTableRow)
  );

interface TProps {
  filter: MaintenanceScheduleArgs | null;
  /** Tables with incomplete events might want to sort by suggested_due, others by completion. */
  notice: (loading: boolean, total: number) => JSX.Element;
  headerBgColor: string;
  selectedSecondaryTab?: number | undefined;
  machines?: Machine[];
  setNumResults?: (num: number | null) => void;
  setSelectedPm: (pm: MaintenanceScheduleTableRow) => void;
  setCompletedEvents?: (ce: MaintenanceScheduleTableRow[]) => void;
  setCurrentMaintenanceSchedulePage?: React.Dispatch<
    React.SetStateAction<MaintenanceSchedule[] | undefined>
  >;
}
export function MaintenanceScheduleTable({
  filter,
  notice,
  headerBgColor,
  machines,
  setNumResults,
  setSelectedPm,
  setCompletedEvents,
  selectedSecondaryTab,
  setCurrentMaintenanceSchedulePage
}: TProps): JSX.Element {
  const [markAllCompleted, setMarkAllCompleted] = useState(false);
  const [showCompletedText, setShowCompletedText] = useState(false);
  const [isMarkerReset, setIsMarkerReset] = useState(false);
  const [sortState, setSortState] = useState<Record<string, SortState>>({
    machineDescription: SortState.unsorted,
    subcomponent: SortState.unsorted,
    suggestedDue: SortState.unsorted
  });
  const { t } = useTranslation(['fpns']);
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();

  useEffect(() => {
    onPageChange(0);
  }, [selectedSecondaryTab]);

  const { data: events, isFetching } = useGetMaintenanceScheduleQuery(
    filter
      ? {
          ...filter,
          limit: ITEMS_PER_PAGE,
          offset: pageNumber
        }
      : skipToken
  );
  const scheduleFrequency = filter?.minimumFrequency;
  const rows = useMemo(() => {
    if (events === undefined || machines === undefined) {
      return [];
    }
    /* eslint-disable  @typescript-eslint/no-non-null-assertion */
    setCurrentMaintenanceSchedulePage!(events.items);
    const evs = addMachineDescToSchedule(events.items as MaintenanceSchedule[], machines);
    return formatSchedulesIntoRows(evs);
  }, [events]);
  const sortedData = useSort<MaintenanceScheduleTableRow>(sortState, rows);
  useEffect(() => {
    if (setNumResults === undefined) {
      return;
    }
    if (markAllCompleted) {
      setMarkAllCompleted(!markAllCompleted);
      setIsMarkerReset(true);
    }
    if (showCompletedText) {
      setShowCompletedText(!showCompletedText);
    }
    setNumResults(events ? events.total : null);
  }, [events]);

  const sortColumnClicked = function (column: SortableColumn) {
    let columntState = sortState[column];
    Object.keys(sortState).forEach((field) => {
      if (field !== column) {
        setSortState((currSortState) => {
          return { ...currSortState, [field]: SortState.unsorted };
        });
      }
    });
    setSortState((currSortState) => {
      if (columntState == SortState.ascending) {
        columntState = SortState.descending;
      } else if (columntState === SortState.descending) {
        columntState = SortState.unsorted;
      } else {
        columntState = SortState.ascending;
      }

      return { ...currSortState, [column]: columntState };
    });
  };

  if (!events || !machines) {
    return <Loader />;
  }
  return (
    <>
      <MaintenanceScheduleTableQueryHeader>
        {notice(isFetching, events.total)}
        <PermissionWrapper page={PermissionScopeName.MAINTENANCE_MANAGER} scope={UserScopes.Write}>
          <Button
            width="auto"
            icon={mark_all_complete}
            variant="thin"
            onClick={() => {
              setMarkAllCompleted(!markAllCompleted);
              setShowCompletedText(!showCompletedText);
            }}
            disabled={false}
          >
            {!showCompletedText ? t('mark_all_as_complete') : t('reset_all')}
          </Button>
        </PermissionWrapper>
      </MaintenanceScheduleTableQueryHeader>

      <MaintenanceScheduleTableQuery
        data={sortedData}
        isDataLoading={isFetching}
        headerBgColor={headerBgColor}
        setSelectedPm={setSelectedPm}
        sortState={sortState}
        sortColumnClicked={sortColumnClicked}
        markAllCompleted={markAllCompleted}
        pageNumber={pageNumber}
        scheduleFrequency={scheduleFrequency}
        showCompletedText={showCompletedText}
        setShowCompletedText={setShowCompletedText}
        isMarkerReset={isMarkerReset}
        setIsMarkerReset={setIsMarkerReset}
        selectedSecondaryTab={selectedSecondaryTab}
        setCompletedMaintenanceEvents={setCompletedEvents}
      />
      <Pagination
        onPageChange={onPageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        numItems={events.total}
        forcePage={pageNumber}
        currentPage={pageNumber}
      />
    </>
  );
}
