import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import BarChart from '.';

export default {
  title: 'Charting/CustomizedBarChart',
  component: BarChart
} as Meta;

const Template: Story<ComponentProps<typeof BarChart>> = (args) => (
  <div style={{ width: '400px' }}>
    <BarChart {...args} />
  </div>
);

const bars = [
  { x: 'Run', y: 50, color: '#93C5FD' },
  { x: 'Clean', y: 25, color: '#C4B5FD' },
  { x: 'Idle', y: 15, color: '#F0ABFC' },
  { x: 'Stopped', y: 10, color: '#FECDD3' }
];

export const Basic = Template.bind({});
Basic.args = {
  dims: { height: 220, width: 400 },
  bars
};

export const WithLabels = Template.bind({});
WithLabels.args = {
  dims: { height: 220, width: 400 },
  bars,
  config: {
    bar: {
      labels: ({ datum }) => `${datum.y}%`
    }
  }
};

export const WithTicksFormatted = Template.bind({});
WithTicksFormatted.args = {
  dims: { height: 220, width: 400 },
  bars,
  config: {
    bar: {
      labels: ({ datum }) => `${datum.y}%`
    }
  },
  format: (tick) => `${tick}%`
};

export const ThinBars = Template.bind({});
ThinBars.args = {
  dims: { height: 220, width: 400 },
  bars,
  config: {
    bar: {
      labels: ({ datum }) => `${datum.y}%`,
      barRatio: 0.5
    }
  },
  format: (tick) => `${tick}%`
};

export const MoreBars = Template.bind({});
MoreBars.args = {
  dims: { height: 220, width: 500 },
  bars: [...bars, { x: 'Broken', y: 15, color: '#F0BBFC' }, { x: 'New', y: 25, color: '#AECDD3' }],

  config: {
    bar: {
      labels: ({ datum }) => `${datum.y}%`,
      barRatio: 0.5
    }
  },
  format: (tick) => `${tick}%`
};
