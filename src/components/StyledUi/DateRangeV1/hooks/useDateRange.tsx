import React, { createContext, useContext, useState, ReactNode } from 'react';
import moment, { Moment } from 'moment-timezone';

import { DateRangeProps } from '../DateRange.types';

export interface DateRangeContextProps {
  dateRange: DateRangeProps;
  setDateRange: (range: DateRangeProps) => void;
  isoDateRange: {
    startTime: string;
    endTime: string;
  };
  utcDateRange: {
    startTime: string;
    endTime: string;
  };
  timeZone: string;
}

export const DateRangeContext = createContext<DateRangeContextProps>({
  dateRange: {
    startTime: moment().subtract(7, 'days').startOf('days').toDate(),
    endTime: moment().toDate()
  },
  setDateRange: (range: DateRangeProps) => console.log('status not set' + range),
  isoDateRange: {
    startTime: ``,
    endTime: ``
  },
  utcDateRange: {
    startTime: ``,
    endTime: ``
  },
  timeZone: moment.tz.guess() || `UTC`
});

export const useDateRange = (): DateRangeContextProps => useContext(DateRangeContext);

let tzCheck = 0;

export interface DateRangeProviderProps {
  subtractDaysCount?: number;
  subtractHoursCount?: number;
  timeZone?: string;
}

interface Props extends DateRangeProviderProps {
  children?: ReactNode;
}

export const DateRangeProvider = ({
  children,
  subtractDaysCount,
  subtractHoursCount,
  timeZone
}: Props): JSX.Element => {
  // this is track loads to throw a console error for trouble shooting timeZone bugs
  // the first load doesn't count for timeZone
  ++tzCheck;

  // check for incoming timezone, if no timezone, the users local timezone will be used
  if (timeZone) moment.tz.setDefault(timeZone);

  if (tzCheck == 1 && !timeZone) {
    console.warn(`useDateRange()
    Machine Time Zone Not Set:
    Using local time zone.    
  `);
  }

  // this uses moment to guess the local timeZone as a fallback for a machine not having one
  const localTimeZone = moment.tz.guess();

  // moment object that is being set/manipulated
  const [machineDateRange, setMachineDateRange] = useState<{
    startMoment: Moment;
    endMoment: Moment;
  }>({
    startMoment: subtractHoursCount
      ? moment().subtract(subtractHoursCount, 'hours')
      : moment().subtract(subtractDaysCount || 7, 'days'),
    endMoment: moment()
  });

  // moment object converted to Date() object, this is the object being used by components
  const dateRange = {
    startTime: machineDateRange.startMoment.toDate(),
    endTime: machineDateRange.endMoment.toDate()
  };

  // string conversion of Date() to ISO format, including timezone offset
  const isoDateRange = {
    startTime: moment(dateRange.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
    endTime: moment(dateRange.endTime).format('YYYY-MM-DDTHH:mm:ssZ')
  };

  const utcDateRange = {
    startTime: moment.utc(dateRange.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
    endTime: moment.utc(dateRange.endTime).format('YYYY-MM-DDTHH:mm:ssZ')
  };

  // handlers for setting date range, it takes Date() objects fir startTime and endTime and
  // coverts to moment object, then sets the state hook
  const setDateRange = ({ startTime, endTime }: DateRangeProps) =>
    setMachineDateRange({
      startMoment: moment(startTime),
      endMoment: moment(endTime)
    });

  return (
    <DateRangeContext.Provider
      value={{
        dateRange,
        isoDateRange,
        setDateRange,
        timeZone: timeZone || localTimeZone,
        utcDateRange
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};
