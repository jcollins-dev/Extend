import moment from 'moment';
import momentTz from 'moment-timezone';
import { RangeModifier } from 'react-day-picker';

function pad(num: number) {
  return `${num}`.padStart(2, '0');
}

type DateStyle =
  | 'short'
  | 'short-year4'
  | 'long'
  | 'time-elapsed'
  | 'hours-minutes'
  | 'hours-minutes-seconds'
  | 'day-of-week'
  | 'numeric-date-time'
  | 'numeric-month-day'
  | 'day-month-year';

// adpated from
// https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript/67462589#67462589
function formatMilliseconds(milliseconds: number, padStart: boolean): string {
  const asSeconds = milliseconds / 1000;

  let days = undefined;
  let hours = undefined;
  let minutes = Math.floor(asSeconds / 60);
  const seconds = Math.floor(asSeconds % 60);

  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    minutes %= 60;
  }

  if (hours !== undefined && hours > 24) {
    days = Math.floor(hours / 24);
    hours %= 24;
  }

  if (days !== undefined && hours !== undefined)
    return `${days} days ${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}`;
  else if (hours !== undefined)
    return `${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}`;
  else return `${padStart ? pad(minutes) : minutes}:${pad(seconds)}`;
}

export function formatDate(
  date?: Date | number | string,
  style: DateStyle = 'short',
  timeZone?: string | null,
  locale?: string,
  is12Hour?: boolean
): string {
  if (!date) {
    return '';
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (typeof date === 'number') {
    return formatMilliseconds(date.valueOf(), true);
  }

  const userLocale = locale ? [locale] : [];

  // A machine's time zone can be null when unconfigured
  const coalescedTimeZone = timeZone ?? undefined;

  switch (style) {
    case 'short-year4':
      return date.toLocaleDateString(userLocale, {
        year: 'numeric',
        day: '2-digit',
        month: '2-digit',
        timeZone: coalescedTimeZone
      });
    case 'short':
      return date.toLocaleDateString(userLocale, {
        year: '2-digit',
        day: '2-digit',
        month: '2-digit',
        timeZone: coalescedTimeZone
      });
    case 'long':
      return date.toLocaleDateString(userLocale, {
        year: 'numeric',
        day: '2-digit',
        month: '2-digit',
        timeZone: coalescedTimeZone
      });
    case 'hours-minutes':
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: coalescedTimeZone,
        hour12: is12Hour
      });
    case 'hours-minutes-seconds':
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: coalescedTimeZone,
        hour12: is12Hour
      });
    case 'time-elapsed':
      return formatMilliseconds(date.valueOf(), true);
    case 'day-of-week':
      return date.toLocaleDateString(userLocale, {
        weekday: 'short',
        year: '2-digit',
        day: 'numeric',
        month: 'short',
        timeZone: coalescedTimeZone
      });
    case 'day-month-year':
      return date.toLocaleDateString(userLocale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: coalescedTimeZone
      });
    case 'numeric-date-time':
      return date.toLocaleDateString(userLocale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: coalescedTimeZone
      });
    case 'numeric-month-day':
      return date.toLocaleDateString(userLocale, {
        month: '2-digit',
        day: '2-digit',
        timeZone: coalescedTimeZone
      });
  }
}

type DurationFormat = 'hours:mins:secs' | 'days hrs mins secs' | 'hours:mins';

/**
 * Format a number of milliseconds into a string of given format
 * @param durationMillis - the duration in milliseconds
 * @param format - the format to use
 */
export const formatDuration = (durationMillis: number, format: DurationFormat): string => {
  const mDuration = moment.duration(durationMillis, 'milliseconds');

  switch (format) {
    // e.g. 45:00:12
    case 'hours:mins:secs':
      return `${pad(Math.floor(mDuration.asHours()))}:${pad(mDuration.minutes())}:${pad(
        mDuration.seconds()
      )}`;
    // e.g. 45:00
    case 'hours:mins':
      return `${pad(Math.floor(mDuration.asHours()))}:${pad(mDuration.minutes())}`;
    case 'days hrs mins secs':
      return [
        Math.floor(mDuration.days()) > 0 ? `${Math.floor(mDuration.days())} days` : '',
        Math.floor(mDuration.hours()) > 0 ? `${Math.floor(mDuration.hours())} hrs` : '',
        Math.floor(mDuration.minutes()) > 0 ? `${mDuration.minutes()} mins` : '',
        Math.floor(mDuration.seconds()) > 0 ? `${mDuration.seconds()} secs` : ''
      ]
        .filter((a) => a) // drop empty strings
        .join(' ')
        .trim();

    default:
      return '';
  }
};

/**
 * Format a date string to match ISO 8601 date format.
 * This function is needed because Date's toISOString() output
 * does not quite match ISO 8601 and Python's datetime.
 *
 * For example: for Jan 27, 2022, 5:16pm in EST (GMT-5)
 * toISOString() of this date produces -> 2022-01-27T22:16:29.787Z
 *     **note the adjustment to GMT, the Z instead of timezone, and milliseconds (.787)
 *
 * This function outputs the expected YYYY-MM-DDTHH:mm:ssZ format.
 * @param date - a date object to be converted to a string with ISO 8601 format.
 * @param tz - if provided, datetime would be converted to the appropriate TZ
 * e.g machine in 'America/Chicago' time zone, "2022-07-05 00:00" it would be  would be converted to "2022-07-05T00:00:00-05:00"
 */
export const toISO8601 = (date: Date, tz?: string): string => {
  if (tz) {
    const utc = moment(date).utc(true);
    return momentTz.tz(utc.format('YYYY-MM-DD HH:mm:ss'), tz).format();
  }
  return moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
};

export const toCustom = (date: Date): string => {
  return moment(date).format('YYYY-MM-DDTHH:mm:ss');
};

/**
 * Return a new date range by checking if the given day is closer
 * to one day or the other.
 *
 * Should only be called if the dates are between the range endpoints.
 *
 * @param day - A date object that is the new day from which to generate the range
 * @param from - A date object specifying the current "from" day in the range
 * @param to - A date object specifying the current "to" day in the range
 */
export const addDayToRangeBetween = (day: Date, from: Date, to: Date): RangeModifier => {
  const diffFrom = Math.abs(from.getTime() - day.getTime());
  const diffTo = Math.abs(to.getTime() - day.getTime());

  // If closer to the from, replace the from
  if (diffFrom < diffTo) {
    return { from: day, to: to };
  }
  // Otherwise, if closer to the to or equal difference, replace the to
  else {
    return { from: from, to: day };
  }
};

/**
 * Removes hour, minute, second, and millisecond data from a date (for rough comparisons)
 *
 * @param date date object to shorten
 * @returns date object with only day, month, and year
 */
export function getShortDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Calculate duration between to timestamps
 *
 * @param startTimestamp string object to calculate duration
 * @param endTimestamp string object to calculate duration
 * @returns string object with the duration
 */
export const getDurationBetweenTimestamps = (
  startTimestamp: string,
  endTimestamp: string | undefined,
  format?: DurationFormat
): string => {
  let duration = '-';
  if (startTimestamp && endTimestamp) {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);
    const durationAsMillis = endDate.getTime() - startDate.getTime();
    duration = formatDuration(durationAsMillis, format ? format : 'hours:mins:secs');
  }
  return duration;
};

/* Formats date for the Flyout Details */
export const pmFormatDate = (selectedDay: Date): string => {
  const m = moment(selectedDay);
  return m.format('MMM Do YYYY');
};
export const standardFormatDate = (selectedDay: Date): string => {
  const m = moment(selectedDay);
  return m.format('MM-DD-YYYY');
};

export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * Get user timezone
 *
 * @returns string object with the user timezone
 */
export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Check if user timezone is from US
 *
 * @returns true if it is a US timezone
 */
export const isUSTimeZone = (timeZone: string): boolean => {
  const usTimezones = [
    'America/Adak',
    'America/Anchorage',
    'America/Atka',
    'America/Boise',
    'America/Chicago',
    'America/Denver',
    'America/Detroit',
    'America/Fort_Wayne',
    'America/Indiana/Indianapolis',
    'America/Indiana/Knox',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Tell_City',
    'America/Indiana/Vevay',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Indianapolis',
    'America/Juneau',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Knox_IN',
    'America/Los_Angeles',
    'America/Louisville',
    'America/Menominee',
    'America/Metlakatla',
    'America/New_York',
    'America/Nome',
    'America/North_Dakota/Beulah',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/Phoenix',
    'America/Shiprock',
    'America/Virgin',
    'America/Yakutat',
    'Pacific/Honolulu',
    'US/Alaska',
    'US/Aleutian',
    'US/Arizona',
    'US/Central',
    'US/East-Indiana',
    'US/Eastern',
    'US/Hawaii',
    'US/Indiana-Starke',
    'US/Michigan',
    'US/Mountain',
    'US/Pacific',
    'US/Pacific-New',
    'US/Samoa'
  ];
  return usTimezones.includes(timeZone);
};

/**
 * Format tooltip
 */
export const formatTooltipDateMessage = (time: Date, timeZone: string | undefined): string => {
  return isUSTimeZone(getUserTimeZone())
    ? `${formatDate(time, 'hours-minutes', timeZone)} ${formatDate(
        time,
        'numeric-month-day',
        timeZone,
        'en-US'
      )}`
    : `${formatDate(time, 'hours-minutes', timeZone)} ${formatDate(
        time,
        'numeric-month-day',
        timeZone
      )}`;
};

/* Convert seconds to HH:MM:SS format */
export const ConvertToHHMMSS = (seconds: number): string => {
  const result = new Date(seconds * 1000).toISOString().slice(11, 19);
  return result;
};

export const ConvertHHMMSStoMinutes = (
  timeStampTarget: string,
  timeStampActual: string
): string => {
  // this approach only works if time difference is less than 24 hours
  let difference = Math.floor(
    moment(timeStampActual, 'HH:mm:ss').diff(moment(timeStampTarget, 'HH:mm:ss'), 'minutes')
  );
  if (isNaN(difference)) {
    const splitTimeTarget = timeStampTarget.split(':');
    const splitTimeActual = timeStampActual.split(':');
    const targetSeconds =
      +splitTimeTarget[0] * 60 * 60 + +splitTimeTarget[1] * 60 + +splitTimeTarget[2];
    const actualSeconds =
      +splitTimeActual[0] * 60 * 60 + +splitTimeActual[1] * 60 + +splitTimeActual[2];
    difference = Math.floor((actualSeconds - targetSeconds) / 60);
  }

  return difference > 0 ? ` (+${difference} min)` : difference < 0 ? ` (${difference} min)` : '';
};

export const AddHHMMSS = (firstTimestamp: string, secondTimestamp: string): string => {
  const first = moment.duration(firstTimestamp, 'ms');
  const second = moment.duration(secondTimestamp, 'ms');
  const result = first.add(second);

  const formatted = moment.utc(result.asMilliseconds()).format('HH:mm:ss');
  return formatted;
};
/**
 * Changes the timezone of a date to the local timezone
 * mataining the date & time
 * e.g if date is 2022-08-18T00:00:00-05:00 and the user is located in 'America/Los_Angeles'
 * it will return Thu Aug 18 2022 00:00:00 GMT-0700
 */
export const changeTimeZoneToLocal = (date: string | Date, timeZone?: string): Date => {
  if (typeof date === 'string') {
    return new Date(
      new Date(date).toLocaleString('en-US', {
        timeZone
      })
    );
  }
  return new Date(
    date.toLocaleString('en-US', {
      timeZone
    })
  );
};

/**
 * Converts duration of HH:MM:SS format to hours
 */

export const convertDurationToHours = (durationDate: string): number => {
  const minutes = moment.duration(durationDate).asMinutes();
  return minutes / 60;
};
