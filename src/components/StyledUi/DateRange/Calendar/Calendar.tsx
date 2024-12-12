import React from 'react';
import moment from 'moment';
import { DateRange } from 'react-date-range';
import { DateRangeProps } from '../DateRange.types';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { sub } from 'date-fns';

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

interface CalendarProps extends StyledUiContainerProps {
  dateRange: DateRangeProps;
  setDateRange: (range: DateRangeProps) => void;
  hasGoBackDateLimit?: number;
  hasFutureDates?: boolean;
}

export const Calendar = ({
  dateRange,
  setDateRange,
  hasGoBackDateLimit,
  className,
  hasFutureDates
}: CalendarProps): JSX.Element => {
  // data does not go back more than 30 days so 30 is set as the default
  hasGoBackDateLimit = hasGoBackDateLimit || 30;

  const minDate = sub(new Date(), { days: hasGoBackDateLimit });

  const handleChange = ({ startTime, endTime }: DateRangeProps) => {
    // gets current date and time
    const now = moment().toDate();
    const startday = moment(startTime).startOf('day').toDate();
    // checks to see if endTime is today to make sure the time doesn't go into the future
    const endsToday = moment(now).isSame(endTime, 'day');
    // if today is selected, make sure that it doesn't go into the future
    endTime = endsToday ? now : moment(endTime).endOf('days').toDate();
    startTime = startday ? startday : startTime;
    // set the new date range
    setDateRange({ startTime, endTime });
  };

  const ranges = [{ startDate: dateRange.startTime, endDate: dateRange.endTime }];

  const maxDate = hasFutureDates ? undefined : new Date();

  return (
    <DateRange
      className={className}
      classNames={customClasses}
      editableDateInputs={true}
      onChange={({ range1 }) =>
        handleChange({ startTime: range1.startDate as Date, endTime: range1.endDate as Date })
      }
      minDate={minDate}
      moveRangeOnFirstSelection={false}
      ranges={ranges}
      calendarFocus="backwards"
      direction="horizontal"
      maxDate={maxDate}
      retainEndDateOnFirstSelection={false}
    />
  );
};
