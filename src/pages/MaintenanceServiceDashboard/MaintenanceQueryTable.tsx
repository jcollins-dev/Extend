// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// Components
import { Loader, MaintenanceTable, Pagination } from 'components';
import { SortableColumn } from 'components/MaintenanceTable/MaintenanceTable';

// Types
import { Machine, SortState } from 'types';
import {
  MaintenanceEvent,
  MaintenanceEventArgs,
  MaintenanceEventTableRow
} from 'types/maintenance';

// Helpers
import { addMachineDescToEvents } from './MaintenanceServiceDashboardContents';

// API
import { useGetMaintenanceEventsQuery } from 'api';

// Hooks
import { usePaginatedQueryOffset, useSort } from 'hooks';

// Constants
import { PAGE_LENGTH } from 'constants/search';

const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;

const formatEventsIntoRows = (data: MaintenanceEvent[]): MaintenanceEventTableRow[] =>
  data.map(
    (item) =>
      ({
        ...item,
        // TODO - connect this to the next task
        nextStep: ''
      } as MaintenanceEventTableRow)
  );

interface TProps {
  filter: MaintenanceEventArgs | null;
  /** Tables with incomplete events might want to sort by suggested_due, others by completion. */
  notice?: (loading: boolean, total: number) => JSX.Element;
  headerBgColor: string;
  machines?: Machine[];
  setNumResults?: (num: number | null) => void;
  setSelectedPm: (pm: MaintenanceEventTableRow) => void;
  showSecondDescription?: boolean;
  onClickCreateService?: (data: MaintenanceEventTableRow) => void;
}

export function MaintenanceQueryTable({
  filter,
  notice,
  headerBgColor,
  machines,
  setNumResults,
  setSelectedPm,
  showSecondDescription,
  onClickCreateService
}: TProps): JSX.Element {
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();
  const [sortState, setSortState] = useState<Record<string, SortState>>({
    machineDescription: SortState.unsorted,
    subcomponent: SortState.unsorted,
    suggestedDue: SortState.unsorted
  });

  const { data: events, isFetching } = useGetMaintenanceEventsQuery(
    filter
      ? {
          ...filter,
          limit: ITEMS_PER_PAGE,
          offset: pageNumber
        }
      : skipToken
  );

  useEffect(() => {
    if (setNumResults === undefined) {
      return;
    }
    setNumResults(events ? events.total : null);
  }, [events]);

  const rows = useMemo(() => {
    if (events === undefined || machines === undefined) {
      return [];
    }
    const evs = addMachineDescToEvents(events.items as MaintenanceEvent[], machines);
    return formatEventsIntoRows(evs);
  }, [events]);
  const sortedData = useSort<MaintenanceEventTableRow>(sortState, rows);
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
      {notice && notice(isFetching, events.total)}
      <MaintenanceTable
        data={sortedData}
        headerBgColor={headerBgColor}
        setSelectedPm={setSelectedPm}
        sortState={sortState}
        sortColumnClicked={sortColumnClicked}
        showSecondDescription={showSecondDescription}
        onClickCreateService={onClickCreateService}
      />
      <Pagination
        onPageChange={onPageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        numItems={events.total}
        currentPage={pageNumber}
      />
    </>
  );
}
