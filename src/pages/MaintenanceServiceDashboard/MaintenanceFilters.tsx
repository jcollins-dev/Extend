import React from 'react';
import { FilterBar, Filter } from 'components';
import { Machine } from 'types';
import {
  MaintenanceEventArgs,
  MaintenanceEventGroup,
  MaintenanceScheduleArgs
} from 'types/maintenance';
import { TabViews } from './MaintenanceServiceDashboardContents';
import styled from 'styled-components';

interface MaintenanceFiltersProp {
  currentTab: TabViews;
  machines: Machine[] | undefined;
  eventGroupsList: MaintenanceEventGroup[] | undefined;
  setPriorityFilter: React.Dispatch<
    React.SetStateAction<MaintenanceEventArgs | MaintenanceScheduleArgs>
  >;
  priorityFilter: MaintenanceEventArgs | MaintenanceScheduleArgs;
  subcomponentsList: { label: string; value: string }[];
  setHistoryFilter: React.Dispatch<
    React.SetStateAction<MaintenanceEventArgs | MaintenanceScheduleArgs>
  >;
  historyFilter: MaintenanceEventArgs | MaintenanceScheduleArgs;
  setPlannedFilter: React.Dispatch<
    React.SetStateAction<MaintenanceEventArgs | MaintenanceScheduleArgs>
  >;
  plannedFilter: MaintenanceEventArgs | MaintenanceScheduleArgs;
}

const FilterSection = styled.div`
  padding: 1.75rem 0 0 1.5rem;
  width: 30%;
`;

export function MaintenanceFilters({
  currentTab,
  machines,
  eventGroupsList,
  setPriorityFilter,
  priorityFilter,
  subcomponentsList,
  setHistoryFilter,
  historyFilter,
  setPlannedFilter,
  plannedFilter
}: MaintenanceFiltersProp): JSX.Element {
  return (
    <FilterSection>
      {
        <FilterBar>
          {currentTab == TabViews.HighPriority && (
            <Filter
              items={machines}
              setFilter={setPriorityFilter}
              filter={priorityFilter}
              subitemsList={subcomponentsList}
              eventGroupsList={eventGroupsList}
            />
          )}
          {currentTab == TabViews.Planned && (
            <Filter
              items={machines}
              setFilter={setPlannedFilter}
              filter={plannedFilter}
              subitemsList={subcomponentsList}
              eventGroupsList={eventGroupsList}
            />
          )}
          {currentTab == TabViews.History && (
            <Filter
              items={machines}
              setFilter={setHistoryFilter}
              filter={historyFilter}
              subitemsList={subcomponentsList}
              eventGroupsList={eventGroupsList}
            />
          )}
        </FilterBar>
      }
    </FilterSection>
  );
}
