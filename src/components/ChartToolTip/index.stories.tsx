import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import ChartToolTip from '.';

export default {
  title: 'UI/ChartToolTip',
  component: ChartToolTip
} as Meta;

const Template: Story<ComponentProps<typeof ChartToolTip>> = (args) => <ChartToolTip {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: (
    <div style={{ padding: '1rem' }}>
      We can pass any react
      <br />
      element into here
    </div>
  ),
  x: 100,
  y: 100
};
