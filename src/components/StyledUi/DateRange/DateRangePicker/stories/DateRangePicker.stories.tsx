import React, { useState } from 'react';
import { DateRangePicker } from '../DateRangePicker';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import moment from 'moment';
import { useDateRange } from '../../hooks/useDateRange';

const DemoContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  overflow: hidden;

  .wrapper {
    overflow: auto;
    max-height: 100%;
    width: 100%;
  }

  .date-range-picker {
    min-height: 300px;
    width: max-content;
    margin: 0 auto;
  }
`;
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
  const { dateRange, setDateRange } = useDateRange();

  return (
    <DemoContainer>
      <div className="wrapper">
        <div>
          {moment(dateRange.startTime).format('l h:mm a')}{' '}
          {moment(dateRange.endTime).format('l h:mm a')}
        </div>

        <DateRangePicker {...{ ...args, dateRange, handleSubmit: setDateRange }} />
      </div>
    </DemoContainer>
  );
};

export const Picker = Template.bind({});
Picker.args = {
  handleCancel: () => alert('caneled')
};
