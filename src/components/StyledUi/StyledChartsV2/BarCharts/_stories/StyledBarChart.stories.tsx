import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StyledBarChart } from '../StyledBarChart';
import { barChartDemoData } from './barChartDemoData';
import { formatLocaleDate } from 'components/StyledUi/js';
import { defaultLabelStyles } from '../../StyledCharts.styles';
import { convertToStackedChartData } from '../../helpers';

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
  title: 'V2/StyledCharts/BarCharts',
  component: StyledBarChart,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledBarChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StyledBarChart> = (args) => {
  // const chartData = convertToStackedChartData(barChartDemoData as Record<string, unknown>[], 'code', 'date')

  return (
    <DemoContainer>
      <div>
        <StyledBarChart {...args} data={barChartDemoData} />
      </div>
    </DemoContainer>
  );
};

export const BarChart = Template.bind({});
BarChart.args = {
  groupKey: 'type',
  categoryKey: 'date',
  stroke: 'red',
  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;

      return [`${datum.date}`, ` \n `, `Count: ${Math.round(Number(datum['value']))}%`];
    },
    axisY: (datum: string) => datum
  },

  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
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
