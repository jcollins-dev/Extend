// fetch from API here:

import React, { useCallback, useMemo, useReducer } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AlarmsTableFPNS } from 'components/machine-health/AlarmsTable/AlarmsTableFPNS';
import { useGetAvureAlarmsQuery } from 'api';
import { useDateRange } from 'components';

// Helpers
import { isAlarmVisible } from 'helpers';
import { StateHistoryButtons } from 'components';
import { Alarm, AlarmType, AlarmSummary } from 'types/machine-health/alarms';
import { AlarmsTableSummary, AlarmsStackedBarChart, DataRenderer } from 'components/machine-health';
import moment from 'moment';

import { filterReducer, initialFilterState } from './filterReducer';
import { cloneDeep } from 'lodash';

import { useColorMap } from 'hooks';
import theme from 'themes';
import AvureAlarmCharts from '../components/AvureAlarmPieChart';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import { sortByKey } from 'components/StyledUi/PageLayouts/ChartsWithFiltersPage/helpers/processAlarmsData';

const TableContainer = styled.div`
  table > tbody > tr,
  thead > tr {
    height: 3rem;
  }
`;

const TableContainerSummary = styled.div`
  table > tbody > tr,
  thead > tr {
    height: 3rem;
  }
`;

const ContentContainer = styled.div`
  margin: 0.125rem 0.125rem;

  > * {
    margin-bottom: 1rem;
  }
`;

const LeftColumnWidgetContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  align-items: center;
`;

const RightColumnWidgetContainer = styled.div`
  display: flex;
  flex: 2;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

const WidgetsRowContainer = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

export const SUB_ROUTES = {
  allAlarms: 'all-alarms',
  failedBatches: 'failed-batches'
};

export interface AlarmWithDay extends Alarm {
  day: string; // ISO format at start of day with machine time zone
}

export const matchAlarm = (input: string, alarm: AlarmWithDay): boolean => {
  const allNumbers = /^[0-9]+$/;

  const trimmedInput = input.trim();
  const isNumericInput = allNumbers.test(trimmedInput);

  // Normalize search field casing before comparing
  const uppercaseInput = input.toUpperCase();
  const uppercaseDescription = alarm.description?.toUpperCase();
  const uppercaseLocation = alarm.location.toUpperCase();

  return isNumericInput
    ? alarm.code.includes(input)
    : uppercaseDescription?.includes(uppercaseInput) || uppercaseLocation.includes(uppercaseInput);
};

const filterBarChartData = (
  alarms?: AlarmWithDay[],
  selectedDate?: string, // 'YYYY/MM/DD'
  selectedType?: AlarmType,
  selectedIdType?: AlarmType,
  searchQuery?: string
): AlarmWithDay[] | null => {
  if (!alarms) {
    return null;
  }

  return selectedDate || selectedType || selectedIdType || searchQuery
    ? alarms.filter((alarm) => {
        return (
          (!selectedDate || selectedDate === alarm.day) &&
          (!selectedType || alarm.type === selectedType) &&
          (!selectedIdType || alarm.type === selectedIdType) &&
          (!searchQuery || matchAlarm(searchQuery, alarm))
        );
      })
    : alarms;
};

// Filter alarms user selected filters (date, alarm type, and alarm id type)
export const filterTableData = (
  alarms?: AlarmWithDay[],
  selectedDate?: string,
  selectedType?: AlarmType,
  selectedId?: string,
  selectedIdType?: AlarmType,
  searchQuery?: string
): AlarmWithDay[] | null => {
  if (!alarms) {
    return null;
  }

  return selectedDate || selectedType || selectedIdType || searchQuery
    ? alarms.filter((alarm) => {
        const { code, type } = alarm;
        return (
          (!selectedDate || selectedDate === alarm.day) &&
          (!selectedType || type === selectedType) &&
          (!selectedId || code === selectedId) &&
          (!selectedIdType || type === selectedIdType) &&
          (!searchQuery || matchAlarm(searchQuery, alarm))
        );
      })
    : alarms;
};

// Filters alarm data to render alarm type pie chart
export const filterPieChartData = (
  alarms?: AlarmWithDay[],
  selectedDate?: string,
  searchQuery?: string
): AlarmWithDay[] | null => {
  if (!alarms) {
    return null;
  }

  return selectedDate || searchQuery
    ? alarms.filter((alarm) => {
        return (
          (!selectedDate || selectedDate === alarm.day) &&
          (!searchQuery || matchAlarm(searchQuery, alarm))
        );
      })
    : alarms;
};

export const AlarmPanel = (): JSX.Element => {
  const { machineId } = useFleetMachineAccountData();
  const { dateRange, timeZone, isoDateRange } = useDateRange();

  const { t } = useTranslation(['mh']);

  const match = useRouteMatch();

  const startDatetime = isoDateRange.startTime;
  const endDatetime = isoDateRange.endTime;

  const [
    {
      present: { selectedDate, selectedType, selectedId, selectedIdType, searchQuery },
      past,
      future
    },
    dispatch
  ] = useReducer(filterReducer, initialFilterState);

  // Filter Guards
  const canUndo = past.length !== 0;
  const canRedo = future.length !== 0;
  const canClear = canRedo || canUndo;

  const stateHistoryButtonsSettings = {
    undo: {
      disabled: !canUndo,
      handleClick: () => dispatch({ type: 'UNDO' })
    },
    redo: {
      disabled: !canRedo,
      handleClick: () => dispatch({ type: 'REDO' })
    },
    clear: {
      disabled: !canClear,
      handleClick: () => dispatch({ type: 'CLEAR' })
    }
  };

  const onDayFilterBarClick = useCallback(
    (date: string) => dispatch({ type: 'FILTER_BY_DATE', date }),
    []
  );
  // Fetch alarms from api
  const {
    data: rawData,
    isFetching: alarmsLoading,
    error: alarmsError
  } = useGetAvureAlarmsQuery({
    machineId: machineId as string,
    startDatetime,
    endDatetime
  });

  const transformedAlarms = rawData?.map((alarm) => {
    const { type } = alarm;
    let updatedType = type;

    if (type === AlarmType.AvureCriticalAlarmOld) {
      updatedType = AlarmType.AvureCriticalAlarm;
    } else if (type === AlarmType.AvureProductAlarmOld) {
      updatedType = AlarmType.AvureProductAlarm;
    } else if (type === AlarmType.AvureWarningAlarmOld) {
      updatedType = AlarmType.AvureWarningAlarm;
    }

    return {
      ...alarm,
      type: updatedType
    };
  });

  const data = transformedAlarms ?? [];

  const onTypeFilterSliceClick = useCallback(
    (alarmType: AlarmType) => dispatch({ type: 'FILTER_BY_TYPE', alarmType }),
    []
  );

  // Process fetched data for empty strings in alarm type field - defaults to "Undefined"
  const alarmsData = cloneDeep(data)?.filter((alarm) => isAlarmVisible(alarm)) as AlarmWithDay[];
  alarmsData?.forEach((alarm) => {
    if ((alarm.type as string) === '') {
      alarm.type = AlarmType.Undefined;
    }

    // Codes come back as numbers from API
    alarm.code = alarm.code.toString();

    // Decorate alarm with start of day at machine time zone
    alarm.day = moment(alarm.startTimestamp)
      .tz(timeZone || 'UTC')
      .startOf('day')
      .format();
  });
  const pageIsFetching = alarmsLoading;
  const pageHasData = !!alarmsData;
  const pageHasError = !!alarmsError;

  // Stacked Bar Chart
  const stackedBarChartData = useMemo(
    () => filterBarChartData(alarmsData, selectedDate, selectedType, selectedIdType, searchQuery),
    [alarmsData, selectedDate, selectedType, selectedIdType, searchQuery]
  );

  // Alarms Table Data
  const alarmsTableData = useMemo(
    () =>
      filterTableData(
        alarmsData,
        selectedDate,
        selectedType,
        selectedId,
        selectedIdType,
        searchQuery
      ),
    [alarmsData, selectedDate, selectedType, selectedId, selectedIdType, searchQuery]
  );

  const getColorById = useColorMap(theme.colors.alarmIdColors);
  const alarmPieChartData = useMemo(
    () => filterPieChartData(alarmsData, selectedDate, searchQuery),
    [alarmsData, selectedDate, searchQuery]
  );

  const sortedAlarms =
    alarmsTableData && sortByKey({ data: alarmsTableData, sortKey: `date`, direction: 'down' });

  const alarmsDataSummary: AlarmSummary[] = [];
  if (alarmsTableData != undefined) {
    alarmsTableData.reduce((res: Record<string, AlarmSummary>, value: Alarm) => {
      if (!res[value.code]) {
        res[value.code] = {
          code: value.code,
          description: value.description,
          //type: value.type,
          totalTime: 0,
          count: 0
        };
        alarmsDataSummary.push(res[value.code]);
      }
      const startDate = new Date(value.startTimestamp);
      const endDate = new Date(value.endTimestamp);
      const durationAsMillis = endDate.getTime() - startDate.getTime();
      res[value.code].totalTime += durationAsMillis;
      res[value.code].count += 1;
      return res;
    }, {});
  }

  const sortedSummary =
    alarmsDataSummary && sortByKey({ data: alarmsDataSummary, sortKey: `code`, direction: 'up' });
  return (
    <>
      <ContentContainer>
        <DataRenderer
          isLoading={alarmsLoading}
          error={alarmsError && (t('failed_to_load_data', { ns: 'common' }) as string)}
        >
          <Bar>
            <StateHistoryButtons {...stateHistoryButtonsSettings} />
          </Bar>
          <Switch>
            <Route exact path={`${match.path}/`}>
              <Redirect to={`${match.url}/${SUB_ROUTES.allAlarms}`} />
            </Route>
            <Route>
              {pageHasData &&
                stackedBarChartData &&
                alarmsTableData &&
                alarmsDataSummary &&
                !pageIsFetching &&
                alarmPieChartData &&
                !pageHasError && (
                  <>
                    <WidgetsRowContainer>
                      <RightColumnWidgetContainer>
                        <AlarmsStackedBarChart
                          title={t('alarm_occurrence_by_day')}
                          barValueType="count"
                          onBarClick={onDayFilterBarClick}
                          data={stackedBarChartData}
                          dateRange={{
                            from: dateRange.startTime,
                            to: dateRange.endTime
                          }}
                          timeZone={timeZone || 'UTC'}
                          selectedId={selectedId}
                          selectedType={selectedType}
                          getColorById={getColorById}
                        />
                      </RightColumnWidgetContainer>
                      <LeftColumnWidgetContainer>
                        <AvureAlarmCharts
                          data={alarmPieChartData}
                          selectedType={selectedType}
                          onSliceClick={onTypeFilterSliceClick}
                          selectedId={selectedId}
                          selectedIdType={selectedIdType}
                        />
                      </LeftColumnWidgetContainer>
                    </WidgetsRowContainer>

                    <WidgetsRowContainer>
                      <RightColumnWidgetContainer>
                        <TableContainer>
                          <h3>{t('alarm_details')}</h3>

                          {sortedAlarms && (
                            <AlarmsTableFPNS
                              data={sortedAlarms as Alarm[]}
                              isLoading={pageIsFetching}
                              scrollHeight={350}
                              hideAreaColumn={true}
                            />
                          )}
                        </TableContainer>
                      </RightColumnWidgetContainer>
                      <LeftColumnWidgetContainer>
                        <TableContainerSummary>
                          <h3>{t('alarms_summary')}</h3>

                          {sortedSummary && (
                            <AlarmsTableSummary
                              data={sortedSummary as AlarmSummary[]}
                              isLoading={pageIsFetching}
                              scrollHeight={350}
                            />
                          )}
                        </TableContainerSummary>
                      </LeftColumnWidgetContainer>
                    </WidgetsRowContainer>
                  </>
                )}
              <DataRenderer
                isLoading={alarmsLoading}
                error={alarmsError && (t('failed_to_load_data', { ns: 'common' }) as string)}
              ></DataRenderer>
            </Route>
            <Route path={`${match.path}/${SUB_ROUTES.failedBatches}`}>
              <div></div>
            </Route>
          </Switch>
        </DataRenderer>
      </ContentContainer>
    </>
  );
};

export default AlarmPanel;
