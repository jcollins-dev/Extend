import React from 'react';
import { UiChartsAndFiltersPage } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/UiChartsAndFiltersPage';
import { UseStyledChartProps } from 'components/StyledUi/StyledChartsV2/hooks';
import { useDateRange } from 'components';
import { styledTheme } from 'components';
import { defaultLabelStyles } from 'components/StyledUi/StyledChartsV2/StyledCharts.styles';
import { parseISO, format } from 'date-fns';
import { GetAvureAlarmsProvider, useGetAvureAlarms } from '../hooks';
import { TableAllAlarms, TableAlarmsSummary } from './components';
import { AlarmsViewTablesContainer } from './MachineHealth.elements';
import { useTranslation } from 'react-i18next';

// sending the predefined colors to the charts, this will be used
// for the bar chart and pie chart with legend.
const alarmsColors = styledTheme.charts.avureAlarms;

// this is the legend for the alarms pie chart that is grouped by `type`
// keeping it separate to keep code clean
const alarmsLegendItems = [
  {
    label: 'A-Alarm (Critical)',
    id: 'A-Alarm'
  },
  {
    label: 'B-Alarm (Product)',
    id: 'B-Alarm'
  },
  {
    label: 'C-Alarm (Warning)',
    id: 'C-Alarm'
  }
];

//------------------------------------------------//----/
// TABLES
//------------------------------------------------//----/

/* keep this for use in the future, this is the table that will be used for the alarms details
// alarms summary table
const tableAlarmsSummary: VirtualizedTableProps = {
  // setup the columns for the table
  columnsConfig: [
    {
      label: `Start Date`,
      dataKey: `startTimestamp`,
      width: 155,
      cellRenderer: ({ cellData }) => {
        const date = format(parseISO(cellData), 'P - p');
        return date;
      },
    },
    {
      label: `Duration`,
      dataKey: `duration`,
      width: 60
    },
    {
      label: `ID`,
      dataKey: `code`,
      width: 70
    },
    {
      label: `Type`,
      dataKey: `type`,
      width: 80
    },
    {
      label: `Description`,
      dataKey: `description`,
      width: 200,
      flexGrow: 1
    }
  ]
};
*/

//------------------------------------------------//----/
// CHARTS
//------------------------------------------------//----/

// bar chart over time - grouped by `type` and stacked by `date`
const chartAlarmsOverTime: UseStyledChartProps = {
  colors: alarmsColors,
  type: 'stacked-bar-over-time',
  groupKey: 'type',
  categoryKey: 'date',
  title: 'Alarms Over Time',
  filteredByKeys: ['code'],
  format: {
    tooltip: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      const dateKey = (d.dateKey as string) || 'date';
      const date = datum[dateKey];
      const group = datum[(d.groupKey as string) || 'type'];

      return [`${date}`, ` \n `, `${group}: ${datum.count}`];
    }
  },
  tooltipStyles: [
    { ...defaultLabelStyles, fontSize: 13, fillOpacity: 0.7 },
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 16, fontWeight: 500 }
  ]
};

// pie chart with legend - grouped by `type`
const chartAlarmsByType: UseStyledChartProps = {
  colors: alarmsColors,
  type: 'pie',
  groupKey: 'type',
  title: 'Alarms By Type',
  legendSettings: {
    items: alarmsLegendItems
  },
  format: {
    label: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      return `${Math.round(Number(datum.y))}%`;
    },
    tooltip: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;

      return [
        `${datum.x === 'undefined' ? 'Undefined' : datum.x}: ${datum.count}`,
        ` \n `,
        `${Math.round(Number(datum.y))}%`
      ];
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 16, fontWeight: 500 }
  ]
};

// this has to render AFTER the provider has Loaded
const Provided = () => {
  const { t } = useTranslation(['mh']);
  const { data, ...apiCall } = useGetAvureAlarms();
  const { isoDateRange, dateRange } = useDateRange();

  const start = format(parseISO(isoDateRange.startTime), 'P');
  const end = format(parseISO(isoDateRange.endTime), 'P');

  const csvFileSettings = {
    data,
    fileName: `avure-alarms--${start}-to-${end}.csv`
  };

  chartAlarmsByType.title = t('alarms by type') as string;
  chartAlarmsOverTime.title = t('alarm_occurrence_by_day') as string;

  return (
    <UiChartsAndFiltersPage
      data={data}
      charts={[chartAlarmsOverTime, chartAlarmsByType]}
      dateRange={dateRange || undefined}
      csvSettings={csvFileSettings}
      usesFilteredData
      {...apiCall}
    >
      {
        // we're using nested tables for this page rather than sending the tables
        // to the charts and filters page.
        // The tables are still using the same data and filters
        // that the charts are using. This is because we want to have a custom table
        // this is coded like this so i can add comments
        <AlarmsViewTablesContainer>
          <TableAllAlarms />
          <TableAlarmsSummary />
        </AlarmsViewTablesContainer>
      }
    </UiChartsAndFiltersPage>
  );
};

// we first load the provider, then we can load the charts and filters page and send it the data via
// provider.  At this point, we can add the date picker button and wrapping div.
export const AlarmsView = (): JSX.Element => {
  return (
    <GetAvureAlarmsProvider>
      <Provided />
    </GetAvureAlarmsProvider>
  );
};
