// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Components
import { Loader, MaintenanceTable } from 'components';
import { SortableColumn } from 'components/MaintenanceTable/MaintenanceTable';
import Collapse, { Panel } from 'rc-collapse';
import FilterHeaderNode from './MaintenanceFilterHeader';
// Types
import { Machine, SortState } from 'types';
import {
  MaintenanceEvent,
  MaintenanceEventArgs,
  MaintenanceEventGroup,
  MaintenanceEventTableRow
} from 'types/maintenance';

// Helpers
import { addMachineDescToEvents } from './MaintenanceServiceDashboardContents';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetMaintenanceEventsQuery } from 'api';
import { getSortedData } from 'helpers';

const MenuPanel = styled(Panel)`
  margin-bottom: 1.5rem;
  width: 100%;
  display: inline-block;
`;

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
  allEvents: MaintenanceEvent[];
  setAllRunTimeEvents: React.Dispatch<React.SetStateAction<MaintenanceEvent[]>>;
}

export function MaintenanceRunTimeBasedQueryTable({
  filter,
  notice,
  headerBgColor,
  machines,
  setNumResults,
  setSelectedPm,
  allEvents,
  setAllRunTimeEvents
}: TProps): JSX.Element {
  const [groupedEvents, setGroupedEvents] = useState<MaintenanceEvent[][]>([]);
  const [sortState, setSortState] = useState<Record<string, SortState>>({
    machineDescription: SortState.unsorted,
    subcomponent: SortState.unsorted,
    suggestedDue: SortState.unsorted
  });
  const [activePanelKeys, setActivePanelKeys] = useState<React.Key[]>([]);

  const { data: events, isFetching } = useGetMaintenanceEventsQuery(
    filter
      ? {
          ...filter,
          limit: 100,
          offset: 0
        }
      : skipToken
  );

  useEffect(() => {
    if (setNumResults === undefined) {
      return;
    }
    setNumResults(events ? events.total : null);

    if (events !== undefined && events.items && machines !== undefined) {
      const tempGroupedEvents: MaintenanceEvent[][] = [];

      events?.eventGroups?.forEach((eg: MaintenanceEventGroup) => {
        tempGroupedEvents.push(events?.items?.filter((item) => item.frequency == eg.value));
        activePanelKeys.push(`${eg.value} ${eg.runMetric}`);
      });

      const tempCurrentEvents = [...allEvents, ...events?.items];

      setAllRunTimeEvents(tempCurrentEvents);
      setGroupedEvents(tempGroupedEvents);
      setActivePanelKeys(activePanelKeys);
    }
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
      {notice && notice(isFetching, events.total)}
      <Collapse
        destroyInactivePanel={true}
        activeKey={activePanelKeys}
        onChange={(key: React.Key | React.Key[]) =>
          setActivePanelKeys(Array.isArray(key) ? key : [key])
        }
      >
        {groupedEvents.map((maintenanceEventArray, index) => {
          const rows = formatEventsIntoRows(
            addMachineDescToEvents(maintenanceEventArray, machines)
          );

          const title = `${maintenanceEventArray[0].frequency} ${maintenanceEventArray[0].frequencyType}`;

          return (
            rows && (
              <MenuPanel
                showArrow={true}
                collapsible="header"
                key={title}
                header={FilterHeaderNode(
                  `${title.replaceAll('_', ' ')} (${rows.length})`,
                  undefined,
                  activePanelKeys?.includes(title)
                )}
              >
                <br></br>
                <MaintenanceTable
                  key={index}
                  data={getSortedData<MaintenanceEventTableRow>(sortState, rows)}
                  headerBgColor={headerBgColor}
                  setSelectedPm={setSelectedPm}
                  sortState={sortState}
                  sortColumnClicked={sortColumnClicked}
                />
              </MenuPanel>
            )
          );
        })}
      </Collapse>
    </>
  );
}
