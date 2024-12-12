import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StyledPieChart } from '../StyledPieChart';
import { pieChartDemoData } from './pieChartDemoData';
import { formatLocaleDate } from 'components/StyledUi/js';
import { defaultLabelStyles } from '../../StyledCharts.styles';
import { convertToChartData } from '../../helpers';

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
  title: 'V2/StyledCharts/PieCharts',
  component: StyledPieChart,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledPieChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StyledPieChart> = (args) => {
  // this converts the api call to a smaller data set for use with pie charts.
  // this makes filtering and sorting faster.
  // it gourps all the etries by type, then adds them up and groups them together.
  // which normally adds up to less than 10 entries, rather than the entire api call.
  const chartData = convertToChartData(pieChartDemoData as Record<string, unknown>[], 'type', {
    calculatePercents: true
  });

  return (
    <DemoContainer>
      <div>
        <StyledPieChart {...args} data={chartData} />
      </div>
    </DemoContainer>
  );
};

export const PieChart = Template.bind({});
PieChart.args = {
  groupKey: 'type',

  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;

      return [`${datum.x}: ${datum.count}`, ` \n `, `${Math.round(Number(datum.y))}%`];
    }
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
