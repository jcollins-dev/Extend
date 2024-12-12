// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import TimePicker, { TimePickerValue } from 'react-time-picker';
import moment from 'moment';
import theme from 'themes';

interface Props {
  value?: string | Date;
  maxTime?: string | Date;
  minTime?: string | Date;
  onChange?: (value: string) => void;
}

// Styling
const TimePickerContainer = styled.div`
  & .react-time-picker__clock {
    top: 2.5rem !important;
  }

  & .react-time-picker__wrapper {
    width: 100%;
    height: 100%;
    min-width: 11.125rem;
    min-height: 2.5rem;
    padding: 0 1rem;
    font-size: 0.8125rem;
    line-height: 1.125rem;
    font-weight: 500;
    border: 0.0625rem solid ${theme.colors.lightGrey6};
    border-radius: 0.25rem;
    box-sizing: border-box;
    &:hover {
      background: #e0e4e7;
    }
  }

  svg {
    position: absolute;
    top: 25%;
    right: 5%;
  }
`;

const TimePickerComponent = ({ value, onChange, maxTime, minTime }: Props): JSX.Element => {
  const [timeValue, onChangeTimeValue] = useState(value ?? '4:00');
  return (
    <TimePickerContainer>
      <TimePicker
        maxTime={maxTime}
        minTime={minTime}
        onChange={(timePickerValue: TimePickerValue) => {
          const momentObj = moment(timePickerValue, 'HH:mm');
          const formattedValue = momentObj.format('HH:mm');
          onChangeTimeValue(formattedValue);
          if (onChange) {
            onChange(formattedValue);
          }
        }}
        value={timeValue}
        clearIcon={null}
      />
    </TimePickerContainer>
  );
};

export default TimePickerComponent;
