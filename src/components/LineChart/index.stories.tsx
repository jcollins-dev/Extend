import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import LineChart from '.';

export default {
  title: 'Charting/LineChart',
  component: LineChart
} as Meta;

const Template: Story<ComponentProps<typeof LineChart>> = (args) => (
  <div style={{ width: '300px' }}>
    <LineChart {...args} />
  </div>
);

export const DefaultVariant = Template.bind({});
DefaultVariant.args = {
  data: [
    { x: 220, y: 250 },
    { x: 470, y: 200 },
    { x: 150, y: 300 },
    { x: 50, y: 400 },
    { x: 370, y: 350 }
  ]
};
