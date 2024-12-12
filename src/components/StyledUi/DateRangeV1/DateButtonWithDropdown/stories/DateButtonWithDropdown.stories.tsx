import React from 'react';
import { DateButtonWithDropdown } from '../DateButtonWithDropdown';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import moment from 'moment';
import { DateRangeProps } from '../../DateRange.types';

const demoDateRange: DateRangeProps = {
  startTime: moment().toDate(),
  endTime: moment().toDate()
};

export default {
  title: 'ExtendUi/DateRange/DateButtonWithDropdown',
  component: DateButtonWithDropdown,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    iconOnly: {
      description: 'Set to true if this button only has the calendar icon.',
      control: { type: 'boolean' }
    }
  }
} as ComponentMeta<typeof DateButtonWithDropdown>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DateButtonWithDropdown> = (args) => {
  return (
    <div>
      <div>Current Date Range: </div>
      <DateButtonWithDropdown {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  dateRange: demoDateRange,
  setDateRange: ({ startTime, endTime }: DateRangeProps) => {
    alert('new date range set in console.log');
    return console.log({ startTime, endTime });
  },
  alignDropdown: 'left'
};
