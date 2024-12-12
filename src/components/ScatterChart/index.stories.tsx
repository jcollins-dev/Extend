import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import ScatterChart from './';

export default {
  title: 'Charting/ScatterChart',
  component: ScatterChart
} as Meta;

const Template: Story<ComponentProps<typeof ScatterChart>> = (args) => (
  <div style={{ height: '300px' }}>
    <ScatterChart {...args} />
  </div>
);

export const DefaultVariant = Template.bind({});
DefaultVariant.args = {
  data: [
    { x: 1, y: 0, label: 'Start bottle sorter changeover' },
    { x: 2, y: 0, label: 'Start bottle sorter changeover' },
    { x: 3, y: 0, label: 'Start bottle sorter changeover' },
    { x: 4, y: 0, label: 'Start bottle sorter changeover' },
    { x: 5, y: 0, label: 'Start bottle sorter changeover' }
  ]
};
