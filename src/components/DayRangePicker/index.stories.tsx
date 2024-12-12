import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import DayRangePicker from '.';

export default {
  title: 'UI/DayRangePicker',
  component: DayRangePicker
} as Meta;

const Template: Story<ComponentProps<typeof DayRangePicker>> = (args) => (
  <div>
    <DayRangePicker {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  onDateRangeChange: () => undefined
};
