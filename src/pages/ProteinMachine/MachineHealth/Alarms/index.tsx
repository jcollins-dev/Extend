// 3rd party libs
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import moment from 'moment';
import saveAs from 'file-saver';
import styled from 'styled-components';
import { cloneDeep, debounce, groupBy, keys } from 'lodash';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// adding to push changes again
// Components
import {
  PageGrid,
  Button,
  Input,
  Loader,
  PageTabView,
  Typography,
  TabbedWidget,
  DateButtonWithDropdown,
  useDateRange
} from 'components';

import { MachineAlertsOnlyWidget } from 'components/machine-health/MachineActiveIssues';

import {
  AlarmsIdPieChart,
  AlarmsStackedBarChart,
  AlarmsStatisticsCards,
  AlarmsTable,
  AlarmsTypePieChart
} from 'components/machine-health';

import { AlarmsTypePieChartOnly } from 'components/machine-health/AlarmsTypePieChart';

// Helpersms
import {
  addQuotes,
  formatDate,
  getDurationBetweenTimestamps,
  isAlarmVisible,
  toISO8601
} from 'helpers';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';
import { Alarm, AlarmType, DSIAlarm } from 'types/machine-health/alarms';

// Hooks
import { useColorMap } from 'hooks';

// API
import { useGetAccountInfoQuery, useGetMachineAlarmsQuery } from 'api';

// Theme
import theme from 'themes';

// Reducers
import { filterReducer, initialFilterState } from './filterReducer';

// Providers
import { useTimeZone } from 'providers';
import { AlarmsIdPieChartOnly } from 'components/machine-health/AlarmsIdPieChart';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';
import { formatDataForTable } from 'components/machine-health/AlarmsTable/utils';
import { BaseType } from 'types';

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  align-items: center;
`;

const ActionPillsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: 1.25rem;

  > * + * {
    margin-left: 1.25rem;
  }
`;

const ContentContainer = styled.div`
  margin: 0 3.25rem 1.375rem 3.25rem;

  > * {
    margin-bottom: 2rem;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  grid-gap: 1em;
`;

const StatisticsCardsContainer = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

const TableContainer = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

const StackedBarChartContainer = styled.div`
  display: flex;
  flex: 2;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

const PieChartContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

const row1GridSettings = {
  gridCols: `1fr`,
  gridRows: `auto`,
  gridFlow: 'rows',
  gridAreas: `
    'c-1'
    'c-2'
    'c-3'
  `,
  mediaBreaks: {
    md: {
      gridAreas: `
        'c-1 c-2'
        'c-3 c-3'
      `,
      gridCols: `1fr max-content`
    },
    lg: {
      gridAreas: `'c-1 c-2 c-3'`,
      gridCols: `1fr max-content 1fr`
    }
  }
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

// Filter alarms user selected filters (date, alarm type, and alarm id type)
export const filterBarChartData = (
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

// Filters alarms data to render computed alarm statistics
export const filterStatisticsData = (
  alarms?: AlarmWithDay[],
  selectedDate?: string,
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
    : // return all alarms except warnings by default
      alarms.filter((alarm) => alarm.type !== AlarmType.WarningInformation);
};

interface StatisticsChips {
  countChips: AlarmType[];
  statisticsChips: AlarmType[];
}

// Generate alarm color chips dynamically based on filtering
const generateStatisticsChips = (
  isFiltered: boolean,
  filteredAlarms: AlarmWithDay[] | null,
  alarms?: AlarmWithDay[]
): StatisticsChips => {
  if (!alarms) {
    return { countChips: [], statisticsChips: [] };
  }
  const statisticsChips = keys(groupBy(filteredAlarms, (alarm) => alarm.type)) as AlarmType[];
  const countChips = isFiltered
    ? statisticsChips
    : (keys(groupBy(alarms, (alarm) => alarm.type)) as AlarmType[]);
  return { countChips, statisticsChips };
};

const SearchField = (props: { searchQuery: string; setSearchQuery: (query: string) => void }) => {
  const [value, setValue] = useState('');
  const { t } = useTranslation(['mh']);
  // Debounce setting search query state at page level
  const delayedQuery = useMemo(() => debounce((q) => props.setSearchQuery(q), 300), []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    delayedQuery(event.target.value);
  };

  // Clean up debounce listener
  useEffect(() => {
    return () => {
      delayedQuery.cancel();
    };
  }, []);

  // When user updates the search filter via manual entry, undo, redo, or clear - also
  // update the displayed value in the input
  useEffect(() => {
    setValue(props.searchQuery);
  }, [props.searchQuery]);

  return (
    <Input
      placeholder={t('search_alarms')}
      value={value}
      onChange={handleSearchChange}
      borderRadius="0.5rem"
    />
  );
};

export const AlarmsV2 = (): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { t } = useTranslation(['mh']);
  const {
    data: machineInfo,
    isLoading: isLoadingAccountInfo
    // Don't prevent the page from displaying if the account info is not found; we aren't using the error.
  } = useGetAccountInfoQuery({
    machineId
  });

  const { dateRange, setDateRange, isoDateRange } = useDateRange();

  // Filter State
  const [
    {
      present: { selectedDate, selectedType, selectedId, selectedIdType, searchQuery },
      past,
      future
    },
    dispatch
  ] = useReducer(filterReducer, initialFilterState);

  // Filter Guards
  const isFiltered = !!(selectedDate || selectedType || selectedId || searchQuery);
  const canUndo = past.length !== 0;
  const canRedo = future.length !== 0;
  const canClear = canRedo || canUndo;

  // Filter Actions
  const onUndoClick = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const onRedoClick = useCallback(() => dispatch({ type: 'REDO' }), []);
  const onClearClick = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const onDayFilterBarClick = useCallback(
    (date: string) => dispatch({ type: 'FILTER_BY_DATE', date }),
    []
  );
  const onTypeFilterSliceClick = useCallback(
    (alarmType: AlarmType) => dispatch({ type: 'FILTER_BY_TYPE', alarmType }),
    []
  );
  const onIdFilterSliceClick = useCallback(
    (id: string, alarmIdType: AlarmType) => dispatch({ type: 'FILTER_BY_ID', id, alarmIdType }),
    []
  );
  const onSearch = useCallback(
    (query: string) => dispatch({ type: 'FILTER_BY_SEARCH', query }),
    []
  );

  // Fetch alarms from api
  const {
    data,
    isFetching: alarmsFetching,
    error: alarmsError
  } = useGetMachineAlarmsQuery({
    machineId: machineId,
    startDatetime: isoDateRange.startTime,
    endDatetime: isoDateRange.endTime
  });

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

  const pageIsFetching = alarmsFetching || isLoadingAccountInfo;
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

  // Pie Chart
  const getColorById = useColorMap(theme.colors.alarmIdColors);
  const alarmPieChartData = useMemo(
    () => filterPieChartData(alarmsData, selectedDate, searchQuery),
    [alarmsData, selectedDate, searchQuery]
  );

  // Statistics
  const statisticsData = useMemo(
    () => filterStatisticsData(alarmsData, selectedDate, selectedType, selectedIdType, searchQuery),
    [alarmsData, selectedDate, selectedType, selectedIdType, searchQuery]
  );
  const { countChips, statisticsChips } = useMemo(
    () => generateStatisticsChips(isFiltered, statisticsData, alarmsData),
    [alarmsData, statisticsData, isFiltered]
  );
  const alarmCount = useMemo(
    () => (isFiltered ? statisticsData?.length : alarmsData?.length),
    [statisticsData, alarmsData, isFiltered]
  );

  const downloadAlarmsCSV = () => {
    const csv: BlobPart[] = [];

    csv.push(
      [
        addQuotes('Start Date'),
        addQuotes('Duration'),
        addQuotes('Text'),
        addQuotes('Area'),
        addQuotes('ID'),
        addQuotes('Type'),
        '\n'
      ].join(',')
    );

    if (alarmsTableData) {
      for (const alarm of alarmsTableData) {
        const row = [
          addQuotes(
            formatDate(new Date(alarm.startTimestamp), 'numeric-date-time', timeZone).replace(
              ',', // Remove comma from date string, this is causing issues between Excel versions
              ' -'
            )
          ),
          addQuotes(getDurationBetweenTimestamps(alarm.startTimestamp, alarm.endTimestamp)),
          addQuotes(alarm.description || ''),
          addQuotes(alarm.location),
          addQuotes(alarm.code),
          addQuotes(alarm.type),
          '\n'
        ].join(',');
        csv.push(row);
      }
    }

    const { serialNumber } = machineInfo ?? {};

    let fileName = 'machine-health-alarms';
    fileName += `__from-${moment(dateRange.startTime).format('L')}`;
    fileName += `__to-${moment(dateRange.endTime).format('L')}`;
    serialNumber && (fileName += `__machine-serial-${serialNumber}`);
    fileName += '.csv';

    saveAs(new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }), fileName);
  };

  const hasGoBackDateLimit = DATA_DATE_LIMIT_DAYS;

  const pageTabViewSettings = {
    HeaderRight: <DateButtonWithDropdown {...{ dateRange, setDateRange, hasGoBackDateLimit }} />
  };

  //columns are in the order they will appear in the table
  const columnConfigurations = {
    // put in array in order they will be displayed in a table, dataIndex should be put in this array
    columnsOrder: ['startTime', 'duration', 'description', 'location', 'code', 'type'],
    columnSettings: {
      startTime: {
        title: 'Start Date'
      },
      duration: {
        name: 'Duration'
      },
      description: {
        name: 'Text'
      },
      code: {
        name: 'ID'
      },
      location: {
        name: 'Area'
      },
      type: {
        name: 'Type'
      }
    }
  };

  return (
    <PageTabView {...pageTabViewSettings}>
      <ContentContainer>
        <Bar>
          <SearchField searchQuery={searchQuery} setSearchQuery={onSearch} />

          <ActionPillsContainer>
            <Button variant="default" size="small" onClick={downloadAlarmsCSV}>
              {t('download_csv')}
            </Button>
            <Button
              width="25%"
              variant="default"
              size="small"
              disabled={!canUndo}
              onClick={onUndoClick}
            >
              {t('undo')}
            </Button>
            <Button
              width="25%"
              variant="default"
              size="small"
              disabled={!canRedo}
              onClick={onRedoClick}
            >
              {t('redo')}
            </Button>
            <Button
              width="25%"
              variant="default"
              size="small"
              onClick={onClearClick}
              disabled={!canClear}
            >
              {t('clear_all')}
            </Button>
          </ActionPillsContainer>
        </Bar>
        {pageIsFetching && <Loader />}
        {!pageIsFetching && pageHasError && (
          <Typography color="negativeRed">{t('failed_to_load_alarms_data')}</Typography>
        )}
        {pageHasData &&
          stackedBarChartData &&
          alarmsTableData &&
          alarmPieChartData &&
          statisticsData &&
          !pageIsFetching &&
          !pageHasError && (
            <>
              <PageGrid {...row1GridSettings}>
                <AlarmsStackedBarChart
                  gridArea="c-1"
                  title={t('alarm_types_by_day')}
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
                  chartVersion={2}
                />

                <TabbedWidget
                  gridArea="c-2"
                  title={t('alarms') as string}
                  tabs={{
                    [t('by_alarm_type')]: (
                      <AlarmsTypePieChartOnly
                        data={alarmPieChartData}
                        selectedType={selectedType}
                        onSliceClick={onTypeFilterSliceClick}
                        selectedId={selectedId}
                        selectedIdType={selectedIdType}
                      />
                    ),
                    [t('by_alarm_id')]: (
                      <AlarmsIdPieChartOnly
                        data={alarmPieChartData}
                        onSliceClick={onIdFilterSliceClick}
                        selectedId={selectedId}
                        selectedType={selectedType}
                        getColorById={getColorById}
                      />
                    )
                  }}
                />

                <MachineAlertsOnlyWidget machineId={machineId} gridArea="c-3" />
              </PageGrid>
              <StatisticsCardsContainer>
                <AlarmsStatisticsCards
                  data={statisticsData}
                  isFiltered={isFiltered}
                  alarmCount={alarmCount}
                  countChips={countChips}
                  statisticsChips={statisticsChips}
                />
              </StatisticsCardsContainer>
              <TableContainer>
                <AlarmsTable
                  data={alarmsTableData.sort((a, b) => {
                    const A = a.startTimestamp ? new Date(a.startTimestamp).getTime() : 0;
                    const B = b.startTimestamp ? new Date(b.startTimestamp).getTime() : 0;
                    return B - A;
                  })}
                  isLoading={pageIsFetching}
                  scrollHeight={175}
                  tableColumnConfiguration={columnConfigurations}
                />
              </TableContainer>
            </>
          )}
      </ContentContainer>
    </PageTabView>
  );
};

export const AlarmsV1 = (): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  const {
    data: machineInfo,
    isLoading: isLoadingAccountInfo
    // Don't prevent the page from displaying if the account info is not found; we aren't using the error.
  } = useGetAccountInfoQuery({
    machineId
  });

  const { dateRange, setDateRange } = useDateRange();

  // Filter State
  const [
    {
      present: { selectedDate, selectedType, selectedId, selectedIdType, searchQuery },
      past,
      future
    },
    dispatch
  ] = useReducer(filterReducer, initialFilterState);

  // Filter Guards
  const isFiltered = !!(selectedDate || selectedType || selectedId || searchQuery);
  const canUndo = past.length !== 0;
  const canRedo = future.length !== 0;
  const canClear = canRedo || canUndo;

  // Filter Actions
  const onUndoClick = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const onRedoClick = useCallback(() => dispatch({ type: 'REDO' }), []);
  const onClearClick = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const onDayFilterBarClick = useCallback(
    (date: string) => dispatch({ type: 'FILTER_BY_DATE', date }),
    []
  );
  const onTypeFilterSliceClick = useCallback(
    (alarmType: AlarmType) => dispatch({ type: 'FILTER_BY_TYPE', alarmType }),
    []
  );
  const onIdFilterSliceClick = useCallback(
    (id: string, alarmIdType: AlarmType) => dispatch({ type: 'FILTER_BY_ID', id, alarmIdType }),
    []
  );
  const onSearch = useCallback(
    (query: string) => dispatch({ type: 'FILTER_BY_SEARCH', query }),
    []
  );

  // Fetch alarms from api
  const {
    data,
    isFetching: alarmsFetching,
    error: alarmsError
  } = useGetMachineAlarmsQuery({
    machineId: machineId,
    startDatetime: toISO8601(dateRange.startTime),
    endDatetime: toISO8601(dateRange.endTime)
  });

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

  const pageIsFetching = alarmsFetching || isLoadingAccountInfo;
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

  // Pie Chart
  const getColorById = useColorMap(theme.colors.alarmIdColors);
  const alarmPieChartData = useMemo(
    () => filterPieChartData(alarmsData, selectedDate, searchQuery),
    [alarmsData, selectedDate, searchQuery]
  );

  // Statistics
  const statisticsData = useMemo(
    () => filterStatisticsData(alarmsData, selectedDate, selectedType, selectedIdType, searchQuery),
    [alarmsData, selectedDate, selectedType, selectedIdType, searchQuery]
  );
  const { countChips, statisticsChips } = useMemo(
    () => generateStatisticsChips(isFiltered, statisticsData, alarmsData),
    [alarmsData, statisticsData, isFiltered]
  );
  const alarmCount = useMemo(
    () => (isFiltered ? statisticsData?.length : alarmsData?.length),
    [statisticsData, alarmsData, isFiltered]
  );

  const downloadAlarmsCSV = () => {
    const csv: BlobPart[] = [];

    csv.push(
      [
        addQuotes('Start Date'),
        addQuotes('Duration'),
        addQuotes('Text'),
        addQuotes('Area'),
        addQuotes('ID'),
        addQuotes('Type'),
        '\n'
      ].join(',')
    );

    if (alarmsTableData) {
      for (const alarm of alarmsTableData) {
        const row = [
          addQuotes(
            formatDate(new Date(alarm.startTimestamp), 'numeric-date-time', timeZone).replace(
              ',', // Remove comma from date string, this is causing issues between Excel versions
              ' -'
            )
          ),
          addQuotes(getDurationBetweenTimestamps(alarm.startTimestamp, alarm.endTimestamp)),
          addQuotes(alarm.description || ''),
          addQuotes(alarm.location),
          addQuotes(alarm.code),
          addQuotes(alarm.type),
          '\n'
        ].join(',');
        csv.push(row);
      }
    }

    const { serialNumber } = machineInfo ?? {};

    let fileName = 'machine-health-alarms';
    fileName += `__from-${moment(dateRange.startTime).format('L')}`;
    fileName += `__to-${moment(dateRange.endTime).format('L')}`;
    serialNumber && (fileName += `__machine-serial-${serialNumber}`);
    fileName += '.csv';

    saveAs(new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }), fileName);
  };

  const hasGoBackDateLimit = DATA_DATE_LIMIT_DAYS;
  const pageTabViewSettings = {
    HeaderRight: <DateButtonWithDropdown {...{ dateRange, setDateRange, hasGoBackDateLimit }} />
  };

  //columns are in the order they will appear in the table
  const columnConfigurations = {
    // put in array in order they will be displayed in a table, dataIndex should be put in this array
    columnsOrder: ['startTime', 'duration', 'description', 'location', 'code', 'type'],
    columnSettings: {
      startTime: {
        title: 'Start Date'
      },
      duration: {
        name: 'Duration'
      },
      description: {
        name: 'Text'
      },
      code: {
        name: 'ID'
      },
      location: {
        name: 'Area'
      },
      type: {
        name: 'Type'
      }
    }
  };

  const tableDataRaw = alarmsTableData as unknown as BaseType[];
  const tableConfigs = formatDataForTable(tableDataRaw, timeZone);
  const tableData = tableConfigs.dataArray as unknown as Array<Alarm | DSIAlarm>;
  const tablecolumnsArray = tableConfigs.columnsArray;

  return (
    <PageTabView {...pageTabViewSettings}>
      <ContentContainer>
        <Bar>
          <SearchField searchQuery={searchQuery} setSearchQuery={onSearch} />

          <ActionPillsContainer>
            <Button variant="default" size="small" onClick={downloadAlarmsCSV}>
              Download CSV
            </Button>
            <Button
              width="25%"
              variant="default"
              size="small"
              disabled={!canUndo}
              onClick={onUndoClick}
            >
              Undo
            </Button>
            <Button
              width="25%"
              variant="default"
              size="small"
              disabled={!canRedo}
              onClick={onRedoClick}
            >
              Redo
            </Button>
            <Button
              width="25%"
              variant="default"
              size="small"
              onClick={onClearClick}
              disabled={!canClear}
            >
              Clear all
            </Button>
          </ActionPillsContainer>
        </Bar>
        {pageIsFetching && <Loader />}
        {!pageIsFetching && pageHasError && (
          <Typography color="negativeRed">Failed to load alarms data</Typography>
        )}
        {pageHasData &&
          stackedBarChartData &&
          alarmsTableData &&
          alarmPieChartData &&
          statisticsData &&
          !pageIsFetching &&
          !pageHasError && (
            <>
              <ChartsContainer>
                <StackedBarChartContainer>
                  <AlarmsStackedBarChart
                    title="Alarm Types by Day (# of alarms)"
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
                    chartVersion={2}
                  />
                </StackedBarChartContainer>
                <PieChartContainer>
                  <AlarmsTypePieChart
                    data={alarmPieChartData}
                    selectedType={selectedType}
                    onSliceClick={onTypeFilterSliceClick}
                    selectedId={selectedId}
                    selectedIdType={selectedIdType}
                  />
                </PieChartContainer>
                <PieChartContainer>
                  <AlarmsIdPieChart
                    data={alarmPieChartData}
                    onSliceClick={onIdFilterSliceClick}
                    selectedId={selectedId}
                    selectedType={selectedType}
                    getColorById={getColorById}
                  />
                </PieChartContainer>
              </ChartsContainer>
              <StatisticsCardsContainer>
                <AlarmsStatisticsCards
                  data={statisticsData}
                  isFiltered={isFiltered}
                  alarmCount={alarmCount}
                  countChips={countChips}
                  statisticsChips={statisticsChips}
                />
              </StatisticsCardsContainer>
              <TableContainer>
                <AlarmsTable
                  data={tableData}
                  dataColumns={tablecolumnsArray}
                  isLoading={pageIsFetching}
                  scrollHeight={175}
                  tableColumnConfiguration={columnConfigurations}
                />
              </TableContainer>
            </>
          )}
      </ContentContainer>
    </PageTabView>
  );
};

export default AlarmsV1;
