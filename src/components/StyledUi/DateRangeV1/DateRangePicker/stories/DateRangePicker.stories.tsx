import React, { useState } from 'react';
import { DateRangePicker } from '../DateRangePicker';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import moment from 'moment';
export default {
  title: 'ExtendUi/DateRange/DateRangePicker',
  component: DateRangePicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  // hidden
  argTypes: {
    //Main: { table: { disable: true } }
  }
} as ComponentMeta<typeof DateRangePicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DateRangePicker> = (args) => {
  const [dateRange, setDateRange] = useState({
    startTime: new Date(),
    endTime: new Date()
  });

  return (
    <div>
      <div>
        {moment(dateRange.startTime).format('l h:mm a')}{' '}
        {moment(dateRange.endTime).format('l h:mm a')}
      </div>

      <DateRangePicker {...{ ...args, dateRange, handleSubmit: setDateRange }} />
    </div>
  );
};

export const Picker = Template.bind({});
Picker.args = {
  handleCancel: () => alert('caneled')
};
