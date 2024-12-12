import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Divider from '.';

export default {
  title: 'UI/Divider',
  component: Divider
} as Meta;

const Template: Story<ComponentProps<typeof Divider>> = (args) => (
  <div style={{ width: '300px' }}>
    <Divider {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Performance'
};
