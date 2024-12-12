import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import ActionButton from '.';

export default {
  title: 'UI/ActionButton',
  component: ActionButton
} as Meta;

const Template: Story<ComponentProps<typeof ActionButton>> = (args) => (
  <div style={{ width: '300px' }}>
    <ActionButton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: 'Action Button'
};
