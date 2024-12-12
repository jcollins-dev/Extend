import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import moment, { Moment } from 'moment-timezone';
import { utcToZonedTime } from 'date-fns-tz';
import { parseISO, format } from 'date-fns';
import { DateRangeProps } from '../DateRange.types';

const defStart = moment().subtract(7, 'days').startOf('days');
const defEnd = moment().toDate();

export interface DateRangeContextProps {
  hasGoBackDateLimit?: number;
  hasFutureDates?: boolean;
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
  momentDateRange: {
    startTime: Moment;
    endTime: Moment;
    currentTime: Moment;
  };
  utcTZConvertedISO: {
    startTime: string;
    endTime: string;
  };
  timeZone: string;
  rightNow: Date;
}

export const DateRangeContext = createContext<DateRangeContextProps>({
  dateRange: {
    startTime: defStart.toDate(),
    endTime: defEnd
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
  timeZone: moment.tz.guess() || `UTC`,
  momentDateRange: {
    startTime: defStart,
    endTime: moment(),
    currentTime: moment()
  },
  utcTZConvertedISO: {
    startTime: ``,
    endTime: ``
  },
  rightNow: defEnd
});

export const useDateRange = (): DateRangeContextProps =>
  useContext<DateRangeContextProps>(DateRangeContext);

export interface DateRangeProviderProps {
  subtractDaysCount?: number;
  subtractHoursCount?: number;
  timeZone?: string;
  hasFutureDates?: boolean;
  hasGoBackDateLimit?: number;
  frequencyRefresh?: number;
}

interface Props extends DateRangeProviderProps {
  children?: ReactNode;
}

export const DateRangeProvider = ({
  children,
  subtractDaysCount,
  subtractHoursCount,
  timeZone,
  hasGoBackDateLimit,
  hasFutureDates,
  frequencyRefresh
}: Props): JSX.Element => {
  // check for incoming timezone, if no timezone, the users local timezone will be used
  if (timeZone) moment.tz.setDefault(timeZone);

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

  useEffect(() => {
    if (frequencyRefresh) {
      setInterval(() => {
        setMachineDateRange({
          startMoment: subtractHoursCount
            ? moment().subtract(subtractHoursCount, 'hours')
            : moment().subtract(subtractDaysCount || 7, 'days'),
          endMoment: moment()
        });
      }, frequencyRefresh);
    }
  }, []);

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

  // utcTZConvertedISO will take the current start and end time and
  // calculate what that was in UTC time and convert the times to the UTC time.
  // then it returns the format as
  // 2023-05-24T17:32:39  which do does not have the timezone offset included.
  // this example can be found on the Avure machine pressurization api call
  //
  // TODO:  If this is a better way to do this, please implement.
  //
  const utcTZConvertedISO = {
    startTime: format(
      utcToZonedTime(parseISO(isoDateRange.startTime), isoDateRange.startTime.substring(19)),
      "yyyy-MM-dd'T'HH:mm:ss"
    ),
    endTime: format(
      utcToZonedTime(parseISO(isoDateRange.endTime), isoDateRange.endTime.substring(19)),
      "yyyy-MM-dd'T'HH:mm:ss"
    )
  };

  // handlers for setting date range, it takes Date() objects fir startTime and endTime and
  // coverts to moment object, then sets the state hook
  const setDateRange = ({ startTime, endTime }: DateRangeProps) =>
    setMachineDateRange({
      startMoment: moment(startTime),
      endMoment: moment(endTime)
    });

  const momentDateRange = {
    currentTime: moment(),
    startTime: machineDateRange.startMoment,
    endTime: machineDateRange.endMoment
  };

  const rightNow = moment().toDate();

  return (
    <DateRangeContext.Provider
      value={{
        dateRange,
        isoDateRange,
        setDateRange,
        timeZone: timeZone || localTimeZone,
        utcDateRange,
        momentDateRange,
        rightNow,
        utcTZConvertedISO,
        hasGoBackDateLimit,
        hasFutureDates
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};
