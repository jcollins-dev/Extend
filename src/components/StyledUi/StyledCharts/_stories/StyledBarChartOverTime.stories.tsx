import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StyledStackedBarChart } from '../StyledBarChart/StyledBarChart';
import { demoAlarmsData } from './demoAlarmData';
import { processApiData } from 'components/StyledUi/js';

const DemoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;

  div {
    min-width: 600px;
    width: 100%;
    height: 300px;
  }
`;

export default {
  title: 'StyledUi/StyledCharts/Charts2'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledStackedBarChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StyledStackedBarChart> = (args) => {
  return (
    <DemoContainer>
      <div>
        <StyledStackedBarChart {...args} />
      </div>
    </DemoContainer>
  );
};

// convert the api date to a standard format
const data = processApiData(demoAlarmsData, {
  startTimeKey: 'startTimestamp',
  endTimeKey: 'endTimestamp',
  // this adds just the yyyy-mm-dd part of the value of startTimekey in the data object to key 'date'
  addDateAsKey: 'date',
  // adds the duration in seconds between the start and end time to key 'duration'
  addDurationAsKey: 'duration'
});

export const StyledStackedBarChartDemo = Template.bind({});
StyledStackedBarChartDemo.args = {
  apiData: {
    data
  },
  groupKey: 'type',
  categoryKey: 'date'
};
