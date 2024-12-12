import React from 'react';
import { DateRangeButton } from '../DateRangeButton';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'ExtendUi/DateRange/DateRangeButton',
  component: DateRangeButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    iconOnly: {
      description: 'Set to true if this button only has the calendar icon.',
      control: { type: 'boolean' }
    }
  }
} as ComponentMeta<typeof DateRangeButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DateRangeButton> = (args) => {
  return (
    <div>
      <DateRangeButton {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  handleClick: () => alert('Demo Clicked')
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  handleClick: () => alert('Demo Clicked'),
  iconOnly: true
};
