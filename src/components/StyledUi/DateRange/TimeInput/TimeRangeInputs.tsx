import React from 'react';
import { TimeRangeInputsContainer, baseClass } from './TimeRangeInputs.elements';
import { TimeInput } from './TimeInput';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { DateRangeProps } from '../';
import { DateDisplayArea } from '../DateDisplayArea';

export interface TimeRangeInputsProps extends StyledUiContainerProps {
  setDateRange: (x: DateRangeProps) => void;
  dateRange: DateRangeProps;
}

export const TimeRangeInputs = ({
  className,
  gridArea,
  dateRange,
  setDateRange
}: TimeRangeInputsProps): JSX.Element => {
  className = className ? `${className} ${baseClass}` : baseClass;

  const { startTime, endTime } = dateRange;

  const startTimeSettings = {
    date: startTime,
    handleUpdate: (x: Date) => setDateRange({ endTime, startTime: x })
  };

  const endTimeSettings = {
    date: endTime,
    handleUpdate: (x: Date) => setDateRange({ startTime, endTime: x })
  };

  return (
    <TimeRangeInputsContainer {...{ className, gridArea }}>
      <DateDisplayArea date={startTime} label="from" />
      <DateDisplayArea date={endTime} label="to" />
      <TimeInput {...startTimeSettings} />
      <TimeInput {...endTimeSettings} />
    </TimeRangeInputsContainer>
  );
};
