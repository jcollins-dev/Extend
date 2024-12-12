import React from 'react';
import { TimeInputContainer, baseClass } from './TimeInput.elements';
import { StyledUiContainerProps } from 'components/StyledUi';
import moment from 'moment';
import { IcoChevRight } from 'icons';

interface NumberScrollerProps {
  date: Date;
  handle?: (x: Date) => void;
  type: string;
}

const NumberScroller = ({ date, handle, type }: NumberScrollerProps) => {
  const display = moment(date).format(type === 'hh' ? 'h' : type === 'a' ? 'A' : 'mm');

  const handleUp = () => {
    const newDate = moment(date);
    if (type === 'hh') newDate.add(1, 'hour');
    else if (type === 'a') newDate.add(12, 'hours');
    else newDate.add(1, 'minute');
    return handle?.(newDate.toDate());
  };

  const handleDown = () => {
    const newDate = moment(date);
    if (type === 'hh') newDate.subtract(1, 'hour');
    else if (type === 'a') newDate.subtract(12, 'hours');
    else newDate.subtract(1, 'minute');
    return handle?.(newDate.toDate());
  };

  return (
    <div className={`${baseClass}__time-col`}>
      <button onClick={() => handleUp()} className="time-col-arrow time-col-arrow--up">
        <IcoChevRight />
      </button>
      <span className={`${baseClass}__value`}>{display}</span>
      <button onClick={() => handleDown()} className="time-col-arrow time-col-arrow--down">
        <IcoChevRight />
      </button>
    </div>
  );
};

export interface TimeInputProps extends StyledUiContainerProps {
  date: Date;
  use24Hours?: boolean;
  handleUpdate?: (x: Date) => void;
  isHours?: boolean;
}

export const TimeInput = ({ date, handleUpdate, className }: TimeInputProps): JSX.Element => {
  className = className ? `${baseClass} ${className}` : baseClass;

  const scrollerSettings = {
    date,
    handle: handleUpdate
  };

  return (
    <TimeInputContainer {...{ className }}>
      <NumberScroller {...scrollerSettings} type="hh" />
      <span>:</span>
      <NumberScroller {...scrollerSettings} type="mm" />
      <NumberScroller {...scrollerSettings} type="a" />
    </TimeInputContainer>
  );
};
