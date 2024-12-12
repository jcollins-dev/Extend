import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import TimePicker from '.';

export default {
  title: 'UI/TimePicker',
  component: TimePicker
} as Meta;

const Template: Story<ComponentProps<typeof TimePicker>> = (args) => (
  <div style={{ marginLeft: 100 }}>
    <TimePicker {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  value: '10:00'
};
