import React, { useState, ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Switch from '.';

export default {
  title: 'UI/Switch',
  component: Switch
} as Meta;

const Template: Story<ComponentProps<typeof Switch>> = (args) => {
  const [checked, onChecked] = useState(args.checked ?? false);
  return <Switch {...args} checked={checked} onChange={onChecked} />;
};

export const Default = Template.bind({});
Default.parameters = {
  controls: { hideNoControlsWarning: true }
};
