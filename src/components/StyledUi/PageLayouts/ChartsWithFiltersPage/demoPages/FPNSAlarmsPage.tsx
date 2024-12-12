import React from 'react';
import { useGetAvureAlarmsDemoData } from 'pages/FleetMachineDetail/demoData/useGetAvureAlarmsDemoData';
import { processApiData } from 'components/StyledUi/js/';
import { styledTheme } from 'components/StyledUi/theme';
import { ChartsWithFiltersPage } from '../ChartsWithFiltersPage';
import { VirtualizedTable, VirtualizedTablePropsColumnsConfig } from '../components';
import { useData } from '../hooks';
import { parseISO, format } from 'date-fns';

const data = processApiData(useGetAvureAlarmsDemoData, {
  // ads the start of day as an iso string to new key `date`
  addDateAsKey: `date`,

  // calculates duration and adds new key `duration`
  addDurationAsKey: `duration`,

  // define the time stamp keys
  startTimeKey: `startTimestamp`,
  endTimeKey: `endTimestamp`,
  timeZone: `Europe/Amsterdam`,

  // save the dates in string ISO format
  convertDatesToISO: true,

  // converts the values of `type`, but leaves the key the same
  convertKeys: {
    type: {
      Critical: `A-Alarm`,
      'Product Alarm': `B-Alarm`,
      Warning: `C-Alarm`,
      addAsNewKey: `alarmType`
    },

    // renames the code key to `id`
    code: {
      renameKeyTo: `id`
    }
  }
});

const csvFileSettings = {
  fileName: `demo_file-name_2023-10-30_to_2023-11-15`
};

const pageViewProps = {
  categoryKey: `date`,
  children: 'test',
  csvFileSettings,
  charts: [
    {
      title: 'Stacked Bar Chart',
      chartType: 'stacked-bar',
      groupKey: 'type',
      categoryKey: 'date',
      colors: styledTheme.charts.alarms
    },
    {
      title: 'Pie Chart By Type',
      chartType: 'alarms-pie',
      groupKey: 'type',
      colors: styledTheme.charts.alarms
    }
  ]
};

const tableConfig: VirtualizedTablePropsColumnsConfig[] = [
  {
    label: `Start Date`,
    dataKey: `startTimestamp`,
    width: 110,
    cellRenderer: ({ cellData }) => {
      const date = format(parseISO(cellData), 'P - p');
      return date;
    },
    flexGrow: 1
  },
  {
    label: `Duration`,
    dataKey: `duration`,
    width: 50,
    flexGrow: 1
  },
  {
    label: `ID`,
    dataKey: `id`,
    width: 80,
    flexGrow: 1
  },
  {
    label: `Type`,
    dataKey: `alarmType`,
    width: 100,
    flexGrow: 1
  },
  {
    label: `Description`,
    dataKey: `description`,
    width: 200,
    flexGrow: 1
  }
];

const DemoAllAlarmsTable = (): JSX.Element => {
  const { data, isLoading, hasError, hasMessage } = useData();
  return (
    <VirtualizedTable columnsConfig={tableConfig} {...{ data, isLoading, hasError, hasMessage }} />
  );
};

export const FPNSAlarmsDemoPage = (): JSX.Element => {
  return (
    <ChartsWithFiltersPage {...{ data, ...pageViewProps }}>
      <DemoAllAlarmsTable />
    </ChartsWithFiltersPage>
  );
};
