import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StyledLineChart } from '../StyledLineChart';
import { lineChartDemoData } from './lineChartDemoData';
import { formatLocaleDate } from 'components/StyledUi/js';
import { defaultLabelStyles } from '../../StyledCharts.styles';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;

  div {
    width: 650px;
    height: 300px;
  }
`;

export default {
  title: 'V2/StyledCharts/LineCharts',
  component: StyledLineChart,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledLineChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StyledLineChart> = (args) => {
  return (
    <DemoContainer>
      <div>
        <StyledLineChart {...args} data={lineChartDemoData} />
      </div>
    </DemoContainer>
  );
};

export const SingleLineChart = Template.bind({});
SingleLineChart.args = {
  dateKey: 'timestamp',
  yKey: 'value',
  stroke: 'red',
  interpolation: 'natural',
  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;
      const date = formatLocaleDate(datum['timestamp'] as string, 'short');
      return [`${date}`, ` \n `, `Count: ${Math.round(Number(datum['value']))}%`];
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
};

export const DualLineChart = Template.bind({});
DualLineChart.args = {
  chartKeys: [
    {
      xKey: 'timestamp',
      yKey: 'value',
      stroke: 'blue'
    },
    {
      xKey: 'timestamp',
      yKey: 'target',
      stroke: 'red'
    }
  ],
  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;
      const date = formatLocaleDate(datum['timestamp'] as string, 'short');

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
};
