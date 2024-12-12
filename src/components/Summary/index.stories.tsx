import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Summary from '.';

export default {
  title: 'UI/Summary',
  component: Summary
} as Meta;

const Template: Story<ComponentProps<typeof Summary>> = (args) => (
  <div style={{ width: '28.125rem' }}>
    <Summary {...args} />
  </div>
);

const data = {
  'PRoCARE Status:': 'Active',
  'Under Warranty:': 'XX',
  'Order Number:': 'XX',
  'Serial Number:': 'XX',
  'Machine name on Site:': 'XX',
  'Machine configuration:': 'XX'
};

const multipleLineData = {
  'Name:': 'XX',
  'ID:': 'XX',
  'Duration:': 'XX',
  'Reason:': [
    'Check for snow and ice on the ADF rail.',
    'Check for screw spindle and try to find reason for overload.',
    'Check motor windings and wiring, reset motor circuit breaker'
  ]
};

export const BasicSummary = Template.bind({});
BasicSummary.args = {
  title: 'Account Information',
  data: data
};

export const WithMultipleValueLines = Template.bind({});
WithMultipleValueLines.args = {
  title: 'Alarm Information',
  data: multipleLineData
};
