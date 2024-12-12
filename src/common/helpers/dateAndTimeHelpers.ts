import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { differenceInSeconds, parseISO, format } from 'date-fns';

// converts seconds to 'hh:mm:ss'
export const convertSecondsToTime = (seconds: number): string => {
  // this is an older version, need to test which one works better
  // new Date(seconds * 1000).toISOString().substring(11, 19);

  /* please keep these notes, i'm still trying to figure out which works

  /*
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  */
  return format(new Date(0, 0, 0, 0, 0, seconds), 'H:mm:ss');
};

// converts an iso timestamp with the timezone offset
export const formatTimeStampWithTz = (timestamp: string, tz: string): string =>
  formatInTimeZone(parseISO(timestamp), tz, 'MM/dd/yyyy - hh:mm:ss a');

// takes a UTC timestamp and a timeZone, converts the time stamp to the zoned time and formats back to ISO string format with the offset added to the end of the
// timestamp
export const addTimeZoneToUTCTimeStamp = (timestamp: string, tz: string): string =>
  formatInTimeZone(parseISO(timestamp), tz, `yyyy-MM-dd'T'HH:mm:ssxxx`);

export const convertToUTCTimeStamp = (timestamp: string): string =>
  formatInTimeZone(parseISO(timestamp), 'UTC', `yyyy-MM-dd'T'HH:mm:ssxxx`);

// get the number of seconds between a start and end time, provided in ISO string format
// and return a number value of the amount of seconds between the 2
export const getDurationISOTimeStamps = (start: string, end: string): number =>
  differenceInSeconds(parseISO(start), parseISO(end));

export const getUserLocale = (): string =>
  navigator.languages.length ? navigator.languages[0] : navigator.language;

export type FormatLocaleDatePropsFormatTypes =
  | 'full' // "Monday, November 1, 2021 at 12:00:00 AM Brasilia Standard Time"
  | 'long' // "November 1, 2021 at 12:00:00 AM GMT-3"
  | 'medium' // "Nov 1, 2021, 12:00:00 AM"
  | 'short' // "11/1/21, 12:00 AM"
  | undefined; // uses "short" as default

export const formatLocaleDate = (
  timestamp: string,
  formatType?: FormatLocaleDatePropsFormatTypes
): string => {
  formatType = formatType || 'short';

  const locale = getUserLocale();
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(locale, {
    dateStyle: formatType,
    timeStyle: formatType
  }).format(date);
};

export interface GetCUrrentZonedTimeReturnProps {
  string: string;
  date: Date;
}
export const getCurrentZonedTime = (timeZone: string): GetCUrrentZonedTimeReturnProps => {
  const currentDate = new Date();
  const currentUtcTime = zonedTimeToUtc(currentDate, timeZone);
  const currentZonedTime = utcToZonedTime(currentUtcTime, timeZone);

  return {
    string: format(currentZonedTime, `yyyy-MM-dd'T'HH:mm:ssxxx`),
    date: currentZonedTime
  };
};

export const getDateTime = (dateString: string): string[] => {
  const [date, times] = dateString.split('T');
  const [time] = times.split('+');
  return [date, time];
};
