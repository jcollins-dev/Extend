import React, { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import moment from 'moment';
import { DateRange } from 'react-date-range';
import { DateRangeProps } from '../DateRange.types';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// add custom classes to calendar for styling takeover
const customClasses = {
  dateRangePickerWrapper: 'ui-date-range',
  dateRangeWrapper: 'ui-date-range__calendar-wrapper',
  dateDisplayWrapper: 'ui-date-range__inputs',
  monthAndYearWrapper: 'ui-date-range__date-stepper',
  months: 'ui-date-range__calendar ui-calendar',
  month: 'ui-calendar__month',
  weekDays: 'ui-calendar__week-days',
  days: 'ui-calendar__days'
};

interface CalendarProps {
  dateRange: DateRangeProps;
  setDateRange: (range: DateRangeProps) => void;
  hasGoBackDateLimit?: number;
}

export const Calendar = ({
  dateRange,
  setDateRange,
  hasGoBackDateLimit
}: CalendarProps): JSX.Element => {
  const [newDateRange, setNewDateRange] = useState<DateRangeProps>(dateRange);

  const handleChange = ({ startTime, endTime }: DateRangeProps) => {
    // gets current date and time
    const now = moment().toDate();
    // checks to see if endTime is today to make sure the time doesn't go into the future
    const endsToday = moment(now).isSame(endTime, 'day');
    // if today is selected, make sure that it doesn't go into the future
    endTime = endsToday ? now : moment(endTime).endOf('days').toDate();
    // set the new date range
    setNewDateRange({ startTime, endTime });
  };

  useEffect(() => {
    setDateRange(newDateRange);
  }, [newDateRange]);

  const ranges = [{ startDate: newDateRange.startTime, endDate: newDateRange.endTime }];

  return (
    <DateRange
      classNames={customClasses}
      editableDateInputs={true}
      onChange={({ range1 }) =>
        handleChange({ startTime: range1.startDate as Date, endTime: range1.endDate as Date })
      }
      minDate={hasGoBackDateLimit ? addDays(new Date(), -hasGoBackDateLimit) : undefined}
      moveRangeOnFirstSelection={true}
      ranges={ranges}
      calendarFocus="backwards"
      direction="horizontal"
      maxDate={moment().toDate()}
      retainEndDateOnFirstSelection
    />
  );
};
