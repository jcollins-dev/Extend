import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import StateOverTimeChart from '.';

export default {
  title: 'Charting/StateOverTimeChart',
  component: StateOverTimeChart
} as Meta;

const Template: Story<ComponentProps<typeof StateOverTimeChart>> = (args) => (
  <div style={{ width: '100%' }}>
    <StateOverTimeChart {...args} />
  </div>
);

const runningMockBars = [
  {
    state: 'running',
    startTime: new Date('2022-01-01T00:00:00.000Z'),
    endTime: new Date('2022-01-01T01:00:00.000Z'),
    color: 'green'
  },
  {
    state: 'running',
    startTime: new Date('2022-01-01T02:00:00.000Z'),
    endTime: new Date('2022-01-01T03:00:00.000Z'),
    color: 'green'
  }
];

const stoppedMockBars = [
  {
    state: 'stopped',
    startTime: new Date('2022-01-01T01:00:00.000Z'),
    endTime: new Date('2022-01-01T02:00:00.000Z'),
    color: 'red'
  }
];

const allMockBars = [
  ...runningMockBars.map((b) => ({ ...b, state: 'all' })),
  ...stoppedMockBars.map((b) => ({ ...b, state: 'all' }))
];

export const Default = Template.bind({});
Default.args = {
  padding: { left: 150 },
  rows: [
    {
      state: 'running',
      label: 'Running',
      bars: runningMockBars,
      key: '1'
    },
    {
      state: 'stopped',
      label: 'Stopped',
      bars: stoppedMockBars,
      key: '2'
    }
  ]
};

export const RenderLabelAsButton = Template.bind({});
RenderLabelAsButton.args = {
  padding: { left: 150 },
  rows: [
    {
      state: 'all',
      label: 'All',
      isButton: true,
      bars: allMockBars,
      key: '1'
    },
    {
      state: 'running',
      label: 'Running',
      bars: runningMockBars,
      key: '2'
    },
    {
      state: 'stopped',
      label: 'Stopped',
      bars: stoppedMockBars,
      key: '3'
    }
  ]
};
