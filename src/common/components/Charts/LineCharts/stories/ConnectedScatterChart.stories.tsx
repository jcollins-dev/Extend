import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ConnectedScatterChart } from '../ConnectedScatterChart/ConnectedScatterChart';

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
  title: 'V2/ConnectedScatterChartGroup/ConnectedScatterChart',
  component: ConnectedScatterChart,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      //excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ConnectedScatterChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ConnectedScatterChart> = (args) => {
  return (
    <DemoHolder>
      <ConnectedScatterChart {...args} />
    </DemoHolder>
  );
};

export const ConnectedScatterChartDemo = Template.bind({});
ConnectedScatterChartDemo.args = {
  //groupKey: 'date',
  //valueKey: 'value',
  groupKey: 'date',
  valueKeys: ['value', 'value2'],
  height: 300,
  dateRange: ['2023-01-01T00:00:00+00:00', '2023-01-07T00:00:00+00:00'],
  bottomTickCount: 7,
  colors: {
    value: 'red',
    value2: 'blue'
  },
  data: [
    {
      value: 55,
      value2: 65,
      date: '2023-01-01T00:00:00+00:00'
    },
    {
      value: 75,
      value2: 85,
      date: '2023-01-02T00:00:00+00:00'
    },
    {
      value: 85,
      value2: 95,
      date: '2023-01-03T00:00:00+00:00'
    },
    {
      value: 67,
      value2: 60,
      date: '2023-01-04T00:00:00+00:00'
    },
    {
      value: 72,
      value2: 62,
      date: '2023-01-05T00:00:00+00:00'
    },
    {
      value: 61,
      value2: 71,
      date: '2023-01-06T00:00:00+00:00'
    },
    {
      value: 59,
      value2: 69,
      date: '2023-01-07T00:00:00+00:00'
    }
  ]
};
