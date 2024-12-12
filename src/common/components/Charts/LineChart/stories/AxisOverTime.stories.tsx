import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AxisOverTime } from '../AxisOverTime';

import styled from 'styled-components';

const DemoHolder = styled.div`
  width: 100%;
  height: 300px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export default {
  title: 'V2/AxisOverTimeGroup/AxisOverTime',
  component: AxisOverTime,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      //excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AxisOverTime>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AxisOverTime> = (args) => {
  return (
    <DemoHolder>
      <AxisOverTime {...args} />
    </DemoHolder>
  );
};

export const AxisOverTimeDemo = Template.bind({});
AxisOverTimeDemo.args = {
  //groupKey: 'date',
  //valueKey: 'value',
  data: [
    {
      value: 55,
      date: '2023-01-01T00:00:00+00:00'
    },
    {
      value: 75,
      date: '2023-01-02T00:00:00+00:00'
    },
    {
      value: 85,
      date: '2023-01-03T00:00:00+00:00'
    },
    {
      value: 67,
      date: '2023-01-04T00:00:00+00:00'
    },
    {
      value: 72,
      date: '2023-01-05T00:00:00+00:00'
    },
    {
      value: 61,
      date: '2023-01-06T00:00:00+00:00'
    },
    {
      value: 59,
      date: '2023-01-07T00:00:00+00:00'
    }
  ]
};
