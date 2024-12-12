import React from 'react';
import { DateRangeButtonContainer } from './DateRangeButton.elements';
import { IcoCalendar } from 'icons/IcoCalendar';
import { DateRangeButtonProps } from './DateRangeButton.types';
import { useDateRange, DateRangeProps } from '../';
import moment from 'moment';

const formatDateRange = ({ startTime, endTime }: DateRangeProps) => [
  moment(startTime).format('l h:mm a'),
  moment(endTime).format('l h:mm a')
];

export const DateRangeButton = ({
  dateRange,
  handleClick,
  iconOnly,
  className,
  ga,
  align,
  placeholder
}: DateRangeButtonProps): JSX.Element => {
  /** add custom incoming class to default class  */
  className = className ? `ui-date-range-btn ${className}` : `ui-date-range-btn`;
  // TODO: add widget date range check, then check for page date range
  /** use incoming date range or get page date range */
  dateRange = dateRange || useDateRange().dateRange;
  // generate formated dates for display, first check if they're needed
  const [start, end] = formatDateRange(dateRange);

  const settings = { className, ga, align, iconOnly };

  const Dates = !iconOnly && (
    <>
      <div className="date-col pad-l">{start}</div>
      <div className="spacer-col">-</div>
      <div className="date-col">{end}</div>
    </>
  );

  return (
    <DateRangeButtonContainer onClick={() => handleClick && handleClick()} {...settings}>
      <IcoCalendar />
      {!placeholder ? Dates : ''}
    </DateRangeButtonContainer>
  );
};
