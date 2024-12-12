import React from 'react';
import { TimeInput } from '../TimeInput';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import moment from 'moment';

export default {
  title: 'ExtendUi/DateRange/TimeInput',
  component: TimeInput,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    iconOnly: {
      description: 'Set to true if this button only has the calendar icon.',
      control: { type: 'boolean' }
    }
  }
} as ComponentMeta<typeof TimeInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TimeInput> = (args) => {
  return <TimeInput {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  handleUpdate: () => console.log('update'),
  date: moment().toDate()
};
