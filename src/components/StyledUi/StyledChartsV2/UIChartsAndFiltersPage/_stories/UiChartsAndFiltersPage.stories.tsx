import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UiChartsAndFiltersPage } from '../UiChartsAndFiltersPage';
import { demoData } from './uiChartsAndFiltersDemoData';
import { recipesHistoryDemoTableData } from './recipesHistoryDemoTableData';
import { defaultLabelStyles } from '../../StyledCharts.styles';
import { styledTheme } from 'components/StyledUi/theme';
import { convertSecondsToTime } from 'components/StyledUi/js';

// for TS errors
if (!demoData) console.log({ recipesHistoryDemoTableData });

const DemoContainer = styled.div`
  display: grid;

  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  grid-gap: 1em;

  .bar-chart-ui {
    flex-grow: 1;
    .VictoryContainer {
      height: 200px;
      width: 100%;
    }
  }

  .pie-chart-ui {
    flex-grow: 0;

    .VictoryContainer {
      width: 200px !important;
      height: 200px !important;
    }
  }

  .charts-and-flters-page__search-bar-area {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: inherit;
  }

  .charts-and-flters-page__charts-area {
    display: flex;
    gap: inherit;
  }
`;

export default {
  title: 'V2/StyledCharts',
  component: UiChartsAndFiltersPage,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UiChartsAndFiltersPage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UiChartsAndFiltersPage> = (args) => {
  // const chartData = convertToStackedChartData(barChartDemoData as Record<string, unknown>[], 'code', 'date')

  return <UiChartsAndFiltersPage {...args} data={demoData} />;
};

const alarmsColors = styledTheme.charts.alarms;

const alarmsLegendItems = [
  {
    label: `A-Alarm (Critical)`,
    id: `Critical`
  },
  {
    label: `B-Alarm (Product)`,
    id: `Product Alarm`
  },
  {
    label: `C-Alarm (Warning)`,
    id: `Warning`
  }
];

export const ChartsAndFiltersAlarmsPage = Template.bind({});
ChartsAndFiltersAlarmsPage.args = {
  charts: [
    {
      colors: alarmsColors,
      type: 'stacked-bar-over-time',
      groupKey: 'type',
      categoryKey: 'date',
      title: 'Stacked Bar Chart Demo',
      filteredByKeys: ['code'],
      format: {
        tooltip: (d: Record<string, unknown>) => {
          const datum = d?.datum as Record<string, unknown>;
          return [`${datum.x}: ${datum.count}`, `\n`, `${Math.round(Number(datum.y))}%`];
        }
      },
      tooltipStyles: [
        defaultLabelStyles,
        { fontSize: 5 },
        { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
      ]
    },
    {
      colors: alarmsColors,
      type: 'pie',
      groupKey: 'type',
      title: 'Pie Chart By Type',
      legendSettings: {
        items: alarmsLegendItems
      },
      format: {
        tooltip: (d) => {
          const datum = d?.datum as Record<string, unknown>;
          return [`${datum.x}: ${datum.count}/${d.total}`, `\n`, `${Math.round(Number(datum.y))}%`];
        },
        label: (d) => {
          const datum = d?.datum as Record<string, unknown>;
          return `${Math.round(Number(datum.y))}%`;
        }
      },
      tooltipStyles: [
        defaultLabelStyles,
        { fontSize: 5 },
        { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
      ]
    },

    {
      type: 'pie',
      groupKey: 'code',
      title: 'Pie Chart By Code',
      filteredByKeys: ['type'],
      format: {
        tooltip: (d) => {
          const datum = d?.datum as Record<string, unknown>;
          return [
            `${datum.x}: ${datum.count}/${d.total}`,
            `\n `,
            `${Math.round(Number(datum.y))}%`
          ];
        },
        label: (d) => {
          const datum = d?.datum as Record<string, unknown>;
          return `${Math.round(Number(datum.y))}%`;
        }
      },
      tooltipStyles: [
        defaultLabelStyles,
        { fontSize: 5 },
        { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
      ]
    }
  ],
  hasTotalsBar: true,
  totalsBarSettings: {
    groupKey: 'type',
    groupKeys: ['type', 'code'],
    valueKey: 'duration',
    cells: {
      count: {
        title: 'All Alarms',
        label: 'Total Alarms'
      },
      sum: {
        title: 'All Alarms',
        label: 'Total Duration',
        excludeKeys: ['Warning'],
        format: {
          value: ({ value }) => convertSecondsToTime(value as number)
        }
      },
      average: {
        title: 'All Alarms',
        label: 'Average Duration',
        excludeKeys: ['Warning'],
        format: {
          value: ({ value }) => convertSecondsToTime(value as number)
        }
      }
    }
  }
};

export const ChartsAndFiltersRecipesPage = Template.bind({});
ChartsAndFiltersRecipesPage.args = {
  charts: [
    {
      type: 'stacked-bar-over-time',
      groupKey: 'activerecipe',
      categoryKey: 'date',
      title: 'Stacked Bar Chart Demo',
      format: {
        tooltip: (d) => {
          const datum = d?.datum as Record<string, unknown>;
          return [`${datum.x}: ${datum.count}`, '', `${Math.round(Number(datum.y))}%`];
        }
      },
      tooltipStyles: [
        defaultLabelStyles,
        { fontSize: 5 },
        { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
      ]
    },
    {
      type: 'pie',
      groupKey: 'activerecipe',
      title: 'Pie Chart By Type',
      format: {
        tooltip: (d) => {
          const datum = d?.datum as Record<string, unknown>;
          return [`${datum.x}: ${datum.count}`, ` `, `${Math.round(Number(datum.y))}%`];
        }
      },
      tooltipStyles: [
        defaultLabelStyles,
        { fontSize: 5 },
        { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
      ]
    }
  ]
};

/*
export const DualLineChart = Template.bind({});
DualLineChart.args = {
  chartKeys: [{
    xKey: 'timestamp',
    yKey: 'value',
    stroke: 'blue',
  }, {
    xKey: 'timestamp',
    yKey: 'target',
    stroke: 'red'
  }],
  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;
      const date = formatLocaleDate(datum['timestamp'] as string, 'short');
      console.log({ d })
      return [
        `${date}`,
        ` \n `,
        `${d?.yKey as string}: ${Math.round(Number(datum[d?.yKey as string]))}%`
      ];
    },
    axisY: (datum: string) => {
      const [date, timetz] = datum.split('T');
      const [time] = timetz.split('+' || '-');
      return `${date}\n${time} `;
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
  ]
};*/
