import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { format, parseISO } from 'date-fns';

import { useGetAvureAlarmsQueryDemoData } from 'components/StyledUi/demoData/avureAlarmsQueryDemoData';
import { dsiAlarmsDemoData } from 'components/StyledUi/demoData/dsiAlarmsDemoData';
import { processApiData } from 'components/StyledUi/js';
import { StyledPieChart } from '../StyledPieChart/StyledPieChart';

import { FilteredChartsAndData } from '../FilteredChartsAndData/FilteredChartsAndData';
import { ColorScalePropType } from 'victory-core';

export default {
  title: 'StyledCharts/FilteredChartsLayouts/Demos'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledPieChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FilteredChartsAndData> = (args) => {
  // convert the api date to a standard format
  const processedApiData = processApiData(dsiAlarmsDemoData, {
    startTimeKey: 'timestamp',
    addDateAsKey: 'date',
    addDurationAsKey: 'duration',
    exclude: {
      logType: ['0'],
      senderId: ['19']
    }
  });
  return <FilteredChartsAndData {...args} apiData={{ data: processedApiData }} />;
};

export const DSI = Template.bind({});
DSI.args = {
  csvButtonSettings: {
    fileName: 'alarms'
  },
  charts: [
    {
      groupKey: 'date',
      type: 'stacked-bar',
      categoryKey: 'date',
      filteredByKeys: ['logType', 'senderId'],
      format: {
        tooltip: (datum?: Record<string, unknown>): string => {
          // for dsi: `Alarm Type ${datum?.logType}\nAlarm ID: ${datum?.senderId}\nCount: ${datum?.y}`;
          return `Alarm Type ${datum?.logType}\nAlarm ID: ${datum?.senderId}\nCount: ${datum?.y}\n${datum?.message}`;
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
    },
    {
      groupKey: 'logType',
      type: 'pie',
      setsColors: true,
      filteredByKeys: ['logType'],
      format: {
        tooltip: (datum?: Record<string, unknown>): string =>
          // for dsi: `Alarm ID: ${datum?.senderId}\nCount: ${datum?.count}`
          `Alarm ID: ${datum?.senderId}\nCount: ${datum?.count}\n${datum?.message}`
      },
      widgetUiSettings: {
        title: 'Alarms by ID'
      }
    },
    {
      groupKey: 'senderId',
      type: 'pie',
      autoLegend: true,
      colorScale: 'qualitative' as ColorScalePropType,
      setsColors: true,
      format: {
        tooltip: (datum?: Record<string, unknown>): string =>
          // for dsi: `Alarm Type ${datum?.logType}: ${datum?.y}%`,
          `Alarm Type ${datum?.logType}: ${datum?.y}%`,
        legendItem: (datum?: Record<string, unknown>): string => `Alarm Type ${datum?.label}`
      },
      widgetUiSettings: {
        title: 'Alarms by Type'
      }
    }
  ],
  tables: [
    {
      columnsConfig: [
        {
          label: `Date`,
          dataKey: `timestamp`,
          width: 110,
          cellRenderer: (props: Record<string, unknown>) => {
            const date = format(parseISO(props.cellData as string), 'P - p');
            return date;
          },
          flexGrow: 1
        },
        {
          label: `Log Type`,
          dataKey: `logType`,
          width: 80,
          flexGrow: 1
        },
        {
          label: `Sender Id`,
          dataKey: `senderId`,
          width: 100,
          flexGrow: 1
        },
        {
          label: `Message`,
          dataKey: `message`,
          width: 200,
          flexGrow: 1
        }
      ]
    }
  ]
};
