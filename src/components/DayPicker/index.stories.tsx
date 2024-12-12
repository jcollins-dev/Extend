import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import DayPicker from '.';

export default {
  title: 'UI/DayPicker',
  component: DayPicker
} as Meta;

const Template: Story<ComponentProps<typeof DayPicker>> = (args) => (
  <div style={{ marginLeft: 100 }}>
    <DayPicker {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  icon: 'calendar'
};

export const OverlayRight = Template.bind({});
OverlayRight.args = {
  icon: 'calendar',
  overlayPosition: 'right'
};
