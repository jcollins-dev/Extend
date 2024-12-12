import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { format, parseISO } from 'date-fns';

import { avureAlarmsData } from './avureAlarmsData';
import { processApiData } from 'components/StyledUi/js';
import { StyledPieChart } from '../StyledPieChart/StyledPieChart';

import { FilteredChartsAndData } from '../FilteredChartsAndData/FilteredChartsAndData';

import { styledTheme } from 'components/StyledUi/theme';

export default {
  title: 'StyledCharts/FilteredChartsLayouts/Demos'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledPieChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FilteredChartsAndData> = (args) => {
  // convert the api date to a standard format
  const processedApiData = processApiData(avureAlarmsData, {
    startTimeKey: 'startTimestamp',
    endTimeKey: 'endTimestamp',
    addDateAsKey: 'date',
    addDurationAsKey: 'duration',
    convertKeys: {
      type: {
        Critical: `A-Alarm`,
        'Product Alarm': `B-Alarm`,
        Warning: `C-Alarm`
      }
    }
  });

  const pieChart = {
    // set the colors used for the pie chart, they will also be used for the bar chart.
    // the colors are an object who's keys are the values of charts [groupKey] value.
    // the values are the colors to use for that group (or slice).
    colors: styledTheme.charts.dsiAlarms,

    // we're grouping the data by alarm type so we're sending the groupKey to the pie chart where
    // it will be used to group the data.
    groupKey: 'type',

    // what type of chart is this
    type: 'pie',

    // we're sending it colors, so we want to use them and not the victory auto colors.
    //colorScale: 'qualitative' as ColorScalePropType,
    setsColors: true,

    // custom formatting for the labels
    // TODO: this should be standardized with the option to customize to make this easier.
    format: {
      // format the tooltip for the pie chart slice hover
      tooltip: (datum?: Record<string, unknown>): string => `${datum?.type}: ${datum?.y}%`,
      label: (datum?: Record<string, unknown>): string => {
        return `${datum?.y}%`;
      }
    },

    widgetUiSettings: {
      title: 'Alarms by Type'
    },

    legendSettings: {
      items: [
        {
          label: `A-Alarm (Critical)`,
          id: `A-Alarm`,
          color: styledTheme.charts.dsiAlarms[`A-Alarm`]
        },
        {
          label: `B-Alarm (Product)`,
          id: `B-Alarm`,
          color: styledTheme.charts.dsiAlarms[`B-Alarm`]
        },
        {
          label: `C-Alarm (Warning)`,
          id: `C-Alarm`,
          color: styledTheme.charts.dsiAlarms[`C-Alarm`]
        }
      ]
    }
  };

  const overTimeChart = {
    // this is for grouping the data when converting to a pie chart.
    groupKey: 'type',
    // what key is the category, this is used for the stacked bar chart y-axis
    categoryKey: 'date',

    // what type of chart is this
    type: 'stacked-bar-over-time',

    // this chart is going to be filterd based on what slice is selected only.   this way the search box will not
    // affect it.
    //filteredByKeys: ['type'],

    colors: styledTheme.charts.dsiAlarms,

    format: {
      tooltip: (datum?: Record<string, unknown>): string => {
        return `Alarm Type ${datum?.type}\nAlarm ID: ${datum?.code}\nCount: ${datum?.y}\n${datum?.description}`;
      },
      axisX: (label: string): string => `${label}`,
      axisY: (label: string): string => {
        label = String(label).slice(5);
        const [m, d] = label.split('-');
        //console.log({ d: Number(split?.[0]), m: split?.[1] })
        return `${Number(m)}/${d}`;
      }
    },
    widgetUiSettings: {
      title: 'Alarms by Date'
    }
  };

  return (
    <FilteredChartsAndData
      {...args}
      apiData={{ data: processedApiData }}
      charts={[overTimeChart, pieChart]}
    />
  );
};

export const Avure = Template.bind({});
Avure.args = {
  csvButtonSettings: {
    fileName: 'alarms'
  },
  tables: [
    {
      columnsConfig: [
        {
          label: `Date`,
          dataKey: `startTimestamp`,
          width: 110,
          cellRenderer: (props: Record<string, unknown>) => {
            const date = format(parseISO(props.cellData as string), 'P - p');
            return date;
          },
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
        },
        {
          label: `Description`,
          dataKey: `description`,
          width: 200,
          flexGrow: 1
        }
      ]
    }
  ]
};
