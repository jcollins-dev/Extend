// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { DateButtonWithDropdown, Indicator, Loader, DateRangeProps } from 'components';

import { MaintenanceQueryTable } from './MaintenanceQueryTable';
import { MaintenanceScheduleTable } from './MaintenanceScheduleTable';

// Types
import { Machine } from 'types';
import {
  MaintenanceCreator,
  MaintenanceEvent,
  MaintenanceEventArgs,
  MaintenanceEventStatus,
  MaintenanceEventTableRow,
  MaintenanceFrequencyType,
  MaintenanceSchedule,
  MaintenanceScheduleArgs,
  MaintenanceScheduleTableRow
} from 'types/maintenance';

//Helpers
import { getShortDate, toISO8601 } from 'helpers/dates';
import { SecondaryTabViews, TabViews } from './MaintenanceServiceDashboardContents';
import { MaintenanceRunTimeBasedQueryTable } from './MaintenanceQueryTableByFrequency';
import { RunCycle } from './RunCycle';

const IndicatorContainer = styled.div`
  display: flex;
  direction: row;
  > div {
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 0.375rem;
  }
`;

const RunTimeHeaderContainer = styled.div`
  float: right;
  height: 6.8125rem;
  display: flex;
  align-items: baseline;
  width: 70%;
  justify-content: space-between;
  flex-direction: row-reverse;
  margin-top: 1rem;
  padding-top: 0.625rem;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  min-width: 32rem;
`;

const RunCycleContainer = styled.div`
  min-width: 20rem;
`;

const RunTimeContainer = styled.div`
  position: relative;
`;
const DatePickerContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
`;
const DateRangeLabel = styled.div`
  margin-right: 0.625rem;
  padding-top: 0.625rem;
`;
interface Props {
  filter: MaintenanceEventArgs | MaintenanceScheduleArgs;
  machines?: Machine[];
  setNumResults: (num: number | null) => void;
  setSelectedPm: (pm: MaintenanceEventTableRow | MaintenanceScheduleTableRow) => void;
  secondaryTab: {
    value: SecondaryTabViews;
    selected: boolean;
  }[];
  primaryTab: TabViews;
  onClickCreateService?: (data: MaintenanceEventTableRow) => void;
  updateCompletedEvents?: (cm: MaintenanceScheduleTableRow[]) => void;
  setCurrentMaintenanceSchedulePage?: React.Dispatch<
    React.SetStateAction<MaintenanceSchedule[] | undefined>
  >;
}

const getRunTimeBasedFilter = (
  dateRange: DateRangeProps,
  maintenancesFrequencyType?: MaintenanceFrequencyType[]
): MaintenanceEventArgs => {
  if (dateRange.startTime.toString() === dateRange.endTime.toString()) {
    // default state before date selection
    return {
      status: MaintenanceEventStatus.NotComplete,
      ...(maintenancesFrequencyType && { frequencyType: maintenancesFrequencyType }),
      includeGroups: true,
      withoutPagination: true
    };
  }
  return {
    ...(dateRange.startTime && { dateAfter: toISO8601(getShortDate(dateRange.startTime)) }),
    ...(dateRange.endTime && { dateBefore: toISO8601(getShortDate(dateRange.endTime)) }),
    status: MaintenanceEventStatus.NotComplete,
    ...(maintenancesFrequencyType && { frequencyType: maintenancesFrequencyType }),
    includeGroups: true,
    withoutPagination: true
  };
};

const TopView = ({
  filter,
  machines,
  setNumResults,
  setSelectedPm,
  secondaryTab,
  primaryTab,
  onClickCreateService,
  updateCompletedEvents,
  setCurrentMaintenanceSchedulePage
}: Props): JSX.Element => {
  const theme = useTheme();
  const [currentFilter, setCurrentFilter] = useState<
    MaintenanceEventArgs | MaintenanceScheduleArgs
  >();
  const [cyclesFilter, setCyclesFilter] = useState<MaintenanceEventArgs | null>(null);
  const [runHoursFilter, setRunHoursFilter] = useState<MaintenanceEventArgs | null>(null);
  const [sipFilter, setSipFilter] = useState<MaintenanceEventArgs | null>(null);
  const [currentTab, setCurrentTab] = useState<SecondaryTabViews | number>();
  const [tableName, setTableName] = useState('');
  const [allRunTimeEvents, setAllRunTimeEvents] = useState<MaintenanceEvent[]>([]);
  const { t } = useTranslation(['fpns']);
  //default date range:
  //start: 1 month before current date
  //end: 10 years after current date
  const [dateRange, setDateRangeState] = useState<DateRangeProps>({
    startTime: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    endTime: new Date(new Date().getTime() + 3650 * 24 * 60 * 60 * 1000)
  });
  const predictiveFilter: MaintenanceEventArgs =
    secondaryTab[SecondaryTabViews.Predictive]?.selected && machines && machines.length > 0
      ? {
          creator: MaintenanceCreator.Predictive,
          status: MaintenanceEventStatus.NotComplete
        }
      : {};

  const serviceTechFilter: MaintenanceEventArgs =
    secondaryTab[SecondaryTabViews.ServiceTech]?.selected && machines && machines.length > 0
      ? {
          creator: MaintenanceCreator.User,
          status: MaintenanceEventStatus.NotComplete
        }
      : {};

  const runTimeBasedCyclesFilter: MaintenanceEventArgs =
    secondaryTab[SecondaryTabViews.RunTimeBased]?.selected && machines && machines.length > 0
      ? getRunTimeBasedFilter(dateRange, [MaintenanceFrequencyType.Cycles])
      : {};
  const runTimeBasedRunHoursFilter: MaintenanceEventArgs =
    secondaryTab[SecondaryTabViews.RunTimeBased]?.selected && machines && machines.length > 0
      ? getRunTimeBasedFilter(dateRange, [MaintenanceFrequencyType.RunHours])
      : {};
  const runTimeBasedSipFilter: MaintenanceEventArgs =
    secondaryTab[SecondaryTabViews.RunTimeBased]?.selected && machines && machines.length > 0
      ? getRunTimeBasedFilter(dateRange, [MaintenanceFrequencyType.Sip])
      : {};

  const resolvedFilter: MaintenanceEventArgs = {
    status: MaintenanceEventStatus.Completed
  };

  const dailyFilter: MaintenanceScheduleArgs = {
    frequencyType: MaintenanceFrequencyType.Days,
    minimumFrequency: 1,
    maximumFrequency: 2
  };

  const weeklyFilter: MaintenanceScheduleArgs = {
    frequencyType: MaintenanceFrequencyType.Days,
    minimumFrequency: 7,
    maximumFrequency: 14
  };

  const monthlyFilter: MaintenanceScheduleArgs = {
    frequencyType: MaintenanceFrequencyType.Days,
    minimumFrequency: 28,
    maximumFrequency: 31
  };

  const quarterlyFilter: MaintenanceScheduleArgs = {
    frequencyType: MaintenanceFrequencyType.Days,
    minimumFrequency: 90,
    maximumFrequency: 90
  };
  const halfYearlyFilter: MaintenanceScheduleArgs = {
    frequencyType: MaintenanceFrequencyType.Days,
    minimumFrequency: 180,
    maximumFrequency: 182
  };
  const yearlyFilter: MaintenanceScheduleArgs = {
    frequencyType: MaintenanceFrequencyType.Days,
    minimumFrequency: 350,
    // Set this to undefined to capture anything greater than a year as well
    maximumFrequency: undefined
  };

  useEffect(() => {
    secondaryTab.forEach((tab) => {
      if (tab.value == SecondaryTabViews.Predictive && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceEventArgs), ...predictiveFilter });
        setCurrentTab(SecondaryTabViews.Predictive);
        setTableName(t('predictive_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.RunTimeBased && tab.selected) {
        console.log('filter', filter);
        setCyclesFilter({
          ...(filter as MaintenanceEventArgs),
          ...runTimeBasedCyclesFilter
        });
        setRunHoursFilter({
          ...(filter as MaintenanceEventArgs),
          ...runTimeBasedRunHoursFilter
        });
        setSipFilter({
          ...(filter as MaintenanceEventArgs),
          ...runTimeBasedSipFilter
        });
        setAllRunTimeEvents([]);
        setCurrentTab(SecondaryTabViews.RunTimeBased);
        setTableName(t('periodic_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.ServiceTech && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceEventArgs), ...serviceTechFilter });
        setCurrentTab(SecondaryTabViews.ServiceTech);
        setTableName(t('service_tech_recommendations') as string);
      } else if (tab.value == SecondaryTabViews.Resolved && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceEventArgs), ...resolvedFilter });
        setCurrentTab(SecondaryTabViews.Resolved);
        setTableName(t('resolved_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.Daily && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceScheduleArgs), ...dailyFilter });
        setCurrentTab(SecondaryTabViews.Daily);
        setTableName(t('daily_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.Weekly && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceScheduleArgs), ...weeklyFilter });
        setCurrentTab(SecondaryTabViews.Weekly);
        setTableName(t('weekly_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.Monthly && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceScheduleArgs), ...monthlyFilter });
        setCurrentTab(SecondaryTabViews.Monthly);
        setTableName(t('monthly_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.Quarterly && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceScheduleArgs), ...quarterlyFilter });
        setCurrentTab(SecondaryTabViews.Quarterly);
        setTableName(t('quarterly_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.HalfYearly && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceScheduleArgs), ...halfYearlyFilter });
        setCurrentTab(SecondaryTabViews.HalfYearly);
        setTableName(t('half_yearly_maintenance') as string);
      } else if (tab.value == SecondaryTabViews.Yearly && tab.selected) {
        setCurrentFilter({ ...(filter as MaintenanceScheduleArgs), ...yearlyFilter });
        setCurrentTab(SecondaryTabViews.Yearly);
        setTableName(t('yearly_maintenance') as string);
      }
    });
  }, [secondaryTab, filter]);

  const tableNotice = (loading: boolean, total: number) => {
    return (
      <IndicatorContainer>
        <Indicator color={theme.colors.negativeRed}>
          {tableName} ({total})
        </Indicator>
        {loading ? <Loader size={24} /> : null}
      </IndicatorContainer>
    );
  };
  const setDateRange = (range: DateRangeProps): void => {
    setDateRangeState(range);
    setCyclesFilter({
      ...(filter as MaintenanceEventArgs),
      ...getRunTimeBasedFilter(range, [MaintenanceFrequencyType.Cycles])
    });
    setRunHoursFilter({
      ...(filter as MaintenanceEventArgs),
      ...getRunTimeBasedFilter(range, [MaintenanceFrequencyType.RunHours])
    });
    setSipFilter({
      ...(filter as MaintenanceEventArgs),
      ...getRunTimeBasedFilter(range, [MaintenanceFrequencyType.Sip])
    });
  };
  return (
    <>
      {currentTab == SecondaryTabViews.RunTimeBased && (
        <RunTimeContainer>
          <RunTimeHeaderContainer>
            <RangeContainer>
              <DatePickerContainer className="date-picker-wrapper">
                <DateRangeLabel>{t('filter_by_date')}</DateRangeLabel>
                <DateButtonWithDropdown
                  hideTimeInputs={true}
                  hideDateRangeSelect={true}
                  hideTimeRangeSelect={true}
                  hasFutureDates
                  hasGoBackDateLimit={300}
                  {...{ dateRange, setDateRange }}
                />
              </DatePickerContainer>
            </RangeContainer>
            {allRunTimeEvents.length > 0 && (
              <RunCycleContainer>
                <RunCycle allEvents={allRunTimeEvents} machines={machines} />
              </RunCycleContainer>
            )}
          </RunTimeHeaderContainer>
          <MaintenanceRunTimeBasedQueryTable
            filter={cyclesFilter}
            headerBgColor={theme.colors.lightGrey1}
            machines={machines}
            setNumResults={setNumResults}
            setSelectedPm={setSelectedPm}
            allEvents={allRunTimeEvents}
            setAllRunTimeEvents={setAllRunTimeEvents}
          />
          <MaintenanceRunTimeBasedQueryTable
            filter={runHoursFilter}
            headerBgColor={theme.colors.lightGrey1}
            machines={machines}
            setNumResults={setNumResults}
            setSelectedPm={setSelectedPm}
            allEvents={allRunTimeEvents}
            setAllRunTimeEvents={setAllRunTimeEvents}
          />
          <MaintenanceRunTimeBasedQueryTable
            filter={sipFilter}
            headerBgColor={theme.colors.lightGrey1}
            machines={machines}
            setNumResults={setNumResults}
            setSelectedPm={setSelectedPm}
            allEvents={allRunTimeEvents}
            setAllRunTimeEvents={setAllRunTimeEvents}
          />
        </RunTimeContainer>
      )}
      {currentFilter &&
        primaryTab != TabViews.Planned &&
        currentTab != SecondaryTabViews.RunTimeBased && (
          <MaintenanceQueryTable
            filter={currentFilter as MaintenanceEventArgs}
            notice={tableNotice}
            headerBgColor={theme.colors.lightGrey1}
            machines={machines}
            setNumResults={setNumResults}
            setSelectedPm={setSelectedPm}
            showSecondDescription={currentTab == SecondaryTabViews.Predictive ? false : true}
            onClickCreateService={onClickCreateService}
          />
        )}
      {primaryTab == TabViews.Planned && (
        <MaintenanceScheduleTable
          filter={currentFilter as MaintenanceScheduleArgs}
          notice={tableNotice}
          headerBgColor={theme.colors.lightGrey1}
          machines={machines}
          setNumResults={setNumResults}
          setSelectedPm={setSelectedPm}
          setCompletedEvents={updateCompletedEvents}
          selectedSecondaryTab={currentTab}
          setCurrentMaintenanceSchedulePage={setCurrentMaintenanceSchedulePage}
        />
      )}
    </>
  );
};

export default TopView;
