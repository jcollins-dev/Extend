import React from 'react';
import { UiChartsAndFiltersPage } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/UiChartsAndFiltersPage';
import { UseStyledChartProps } from 'components/StyledUi/StyledChartsV2/hooks';
import { UseProteinMachineAlarmsProvider } from 'pages/ProteinMachine/hooks/useProteinMachineAlarms';
import { useApiData } from 'components/StyledUi/hooks';
import { useDateRange, DateButtonWithDropdown } from 'components';
import { styledTheme } from 'components';
import { defaultLabelStyles } from 'components/StyledUi/StyledChartsV2/StyledCharts.styles';
import { VirtualizedTableProps } from 'components/StyledUi/StyledChartsV2/VirtualizedTable';
import { parseISO, format } from 'date-fns';
import { AlarmsViewContainer } from './Alarms.elements';
import { useTranslation } from 'react-i18next';
import { convertSecondsToTime } from 'components/StyledUi/js';
import { AlarmsTotalsBar } from '../components/AlarmsTotalsBar';

// sending the predefined colors to the charts, this will be used
// for the bar chart and pie chart with legend.
const alarmsColors = styledTheme.charts.proteinAlarms;

// this is the legend for the alarms pie chart that is grouped by `type`
// keeping it separate to keep code clean
const alarmsLegendItems = [
  {
    label: 'Critical Alarm',
    id: 'Critical Alarm'
  },
  {
    label: 'Alarm',
    id: 'Alarm'
  },
  {
    label: 'Warning Information',
    id: 'Warning Information'
  },
  {
    label: 'Undefined',
    id: 'undefined'
  }
];

//------------------------------------------------//----/
// TABLES
//------------------------------------------------//----/

// alarms summary table
const tableAlarmsSummary: VirtualizedTableProps = {
  rowStyler: (datum: Record<string, unknown>) => {
    if (!datum?.duration)
      return {
        background: 'rgb(245, 158, 12)'
      };

    return {};
  },
  // setup the columns for the table
  columnsConfig: [
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
      flexGrow: 1,
      cellRenderer: ({ cellData }) =>
        !cellData || cellData == 0 ? '' : convertSecondsToTime(cellData as number)
    },
    {
      label: `Description`,
      dataKey: `description`,
      width: 200,
      flexGrow: 1
    },
    {
      label: `Area`,
      dataKey: `location`,
      width: 80,
      flexGrow: 1
    },
    {
      label: `ID`,
      dataKey: `code`,
      width: 80,
      flexGrow: 1
    },
    {
      label: `Type`,
      dataKey: `type`,
      width: 100,
      flexGrow: 1
    }
  ]
};

//------------------------------------------------//----/
// CHARTS
//------------------------------------------------//----/

// bar chart over time - grouped by `type` and stacked by `date`
const chartAlarmsOverTime: UseStyledChartProps = {
  colors: alarmsColors,
  type: 'bar-over-time',
  groupKey: 'type',
  categoryKey: 'date',
  title: 'Stacked Bar Chart Demo',
  //filteredByKeys: ['code', 'date', 'type'],
  format: {
    tooltip: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      return [
        `${datum.x === 'undefined' ? 'Undefined' : datum.x}: ${datum.count}`,
        ` \n `,
        `${Math.round(Number(datum.count))}`
      ];
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
  ]
};

// pie chart with legend - grouped by `type`
const chartAlarmsByTpe: UseStyledChartProps = {
  colors: alarmsColors,
  type: 'pie',
  groupKey: 'type',
  title: 'Pie Chart By Type',
  hasLegend: true,
  legendSettings: {
    items: alarmsLegendItems
  },
  //filteredByKeys: ['date', 'type', 'code'],
  format: {
    tooltip: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      return [
        `${datum.x === 'undefined' ? 'Undefined' : datum.x}: ${datum.count}`,
        ` \n `,
        `${Math.round(Number(datum.y))}%`
      ];
    },
    label: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      return [`${datum.y}%`];
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
  ]
};

// pie chart  - grouped by `code`
const chartAlarmsByCode: UseStyledChartProps = {
  type: 'pie',
  groupKey: 'code',
  title: 'Pie Chart By Code',
  //filteredByKeys: ['code', 'date', 'type'],
  format: {
    tooltip: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;

      let desc = datum.description as string;
      desc = desc.length > 40 ? desc.slice(0, 40) + '...' : desc;

      return [
        `Code ${datum.x === 'undefined' ? 'Undefined' : datum.x}: ${datum.count}`,
        ` \n `,
        `${desc}`,
        ` \n `,
        `${Math.round(Number(datum.y))}%`
      ];
    },
    label: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      return [`${datum.y}%`];
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 13 },
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 16, fontWeight: 500 }
  ]
};

// this has to render AFTER the provider has Loaded
const Provided = () => {
  const { t } = useTranslation(['mh']);

  const apiCall = useApiData();

  const { startTime, endTime } = useDateRange().isoDateRange;

  const start = format(parseISO(startTime), 'P');
  const end = format(parseISO(endTime), 'P');

  chartAlarmsOverTime.title = t('alarm_occurrence_by_day') as string;
  chartAlarmsByTpe.title = t('alarms by type') as string;
  chartAlarmsByCode.title = t('alarms by code') as string;

  const csvSettings = {
    ...apiCall,
    fileName: `machine-alarms--${start}-to-${end}.csv`
  };

  const chartSettings = {
    charts: [chartAlarmsOverTime, chartAlarmsByTpe, chartAlarmsByCode],
    tables: [tableAlarmsSummary],
    csvSettings,
    ...apiCall
  };

  return (
    <UiChartsAndFiltersPage {...chartSettings} usesFilteredData>
      <AlarmsTotalsBar />
    </UiChartsAndFiltersPage>
  );
};

// we first load the provider, then we can load the charts and filters page and send it the data via
// provider.  At this point, we can add the date picker button and wrapping div.
export const AlarmsView = (): JSX.Element => {
  const { dateRange, setDateRange } = useDateRange();
  return (
    <UseProteinMachineAlarmsProvider>
      <AlarmsViewContainer>
        <div className="alarms-view__date-picker">
          <DateButtonWithDropdown {...{ dateRange, setDateRange }} />
        </div>
        <Provided />
      </AlarmsViewContainer>
    </UseProteinMachineAlarmsProvider>
  );
};
