import React from 'react';
import { DateRangeButtonContainer } from './DateRangeButton.elements';
import { IcoCalendar } from 'icons/IcoCalendar';
import { DateRangeButtonProps } from './DateRangeButton.types';
import { useDateRange, DateRangeProps } from '../';
import moment from 'moment';

interface FormatDateRangeProps extends DateRangeProps {
  dateFormat?: string;
}

const formatDateRange = ({ startTime, endTime, dateFormat }: FormatDateRangeProps) => {
  let displayFormat = 'l h:mm a';

  if (dateFormat === 'date-only') displayFormat = 'l';

  return [moment(startTime).format(displayFormat), moment(endTime).format(displayFormat)];
};

export const DateRangeButton = ({
  dateFormat,
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
  if (!dateRange) dateRange = useDateRange().dateRange;

  // generate formated dates for display, first check if they're needed
  const [start, end] = formatDateRange({ ...dateRange, dateFormat });

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
