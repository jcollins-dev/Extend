import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StyledPieChart } from '../StyledPieChart/StyledPieChart';
import { demoAlarmsData } from './demoAlarmData';
import { processApiData } from 'components/StyledUi/js';
import { convertToChartData } from '../_helpers/chartDataHelpers';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 500px;
`;

export default {
  title: 'StyledCharts/ChartDemos',
  component: StyledPieChart,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['apiData']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledPieChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StyledPieChart> = (args) => {
  args.apiData = {
    data: processedData
  };
  return (
    <DemoContainer>
      <StyledPieChart {...args} />
    </DemoContainer>
  );
};

// convert the api date to a standard format
const processedData = processApiData(demoAlarmsData, {
  startTimeKey: 'startTimestamp',
  endTimeKey: 'endTimestamp',
  // this adds just the yyyy-mm-dd part of the value of startTimekey in the data object to key 'date'
  addDateAsKey: 'date',
  // adds the duration in seconds between the start and end time to key 'duration'
  addDurationAsKey: 'duration'
});

export const PieChartDemo = Template.bind({});
PieChartDemo.args = {
  groupKey: 'type',
  type: 'pie',

  setsColors: true,
  format: {
    tooltip: (datum?: Record<string, unknown>): string => `${datum?.type}\n${datum?.y}%`
  }
};

export const PieChartWithLegendDemo = Template.bind({});
PieChartWithLegendDemo.args = {
  apiData: {
    data: processedData
  },
  groupKey: 'type',
  autoLegend: true
};
