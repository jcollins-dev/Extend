import { differenceInSeconds, parseISO, format, formatISO, startOfDay } from 'date-fns';

import { utcToZonedTime } from 'date-fns-tz';

export type ProcessAlarmsDataReturnProps = Record<string, unknown>[] | undefined;

export const calculateDateObjectsDuration = (start: Date, end: Date): string | undefined => {
  const duration = differenceInSeconds(end, start);
  const formattedDuration = format(new Date(0, 0, 0, 0, 0, duration), 'H:mm:ss');

  return formattedDuration;
};

export const calculateDuration = (start: string, end: string): string | undefined => {
  //console.log({ start, end })

  //return format(new Date(0, 0, 0, 0, 0), 'H:mm:ss')
  const newStart = parseISO(start);
  const newEnd = parseISO(end);

  if (!newStart || !newEnd) return undefined;

  const duration = differenceInSeconds(newEnd, newStart);
  const formattedDuration = format(new Date(0, 0, 0, 0, 0, duration), 'H:mm:ss');

  return formattedDuration;
};

export type ProcessAlarmsSettingsPropsConvertKeys = Record<string, Record<string, string>>;

export interface ProcessAlarmsSettingsProps {
  /* do you want to add a new key `date` that will have only the date, based on start time to this object?
  the date will be iso formatted the same way the start time string is formatted, but will only have the 
  year month and day */
  addDateAsKey?: string;
  /* gets the difference between start and end time and adds it to a specified key to the object in pre-formatted string
   */
  addDurationAsKey?: string;
  /* show halrms tagged 'hidden' in 'location' key */
  showHidden?: boolean;
  /* calculates duration between startTimeKey and endTimeKey */
  addDuration?: boolean;
  /* current timeZone to use for processing */
  timeZone?: string;
  /* the object key for the item start time */
  startTimeKey?: string;
  /* the object key for the item end time */
  endTimeKey?: string;
  /* convert date objects to iso */
  convertDatesToISO?: boolean;
  /* do you want to covert key values to a new value, or change the name of a key? if so, follow the format below */
  convertValues?: Record<string, unknown>;

  /* EXAMPLE
  keyToConvert: this value will correspond the object key you want to change.
  [keyToConvert]: {  
    // currentValue: the current old value, newValue: the value you want to use
    [currentValue]: newValue,
    [currentValue]: newValue,
    [currentValue]: newValue,
    // addAsNewKey: do you want to replace the current value, or add the new value to a new key
    // newKey: the key you want to add the new values to, leave the old values in place.
    addAsNewKey: newKey
  } 
}
example: i want the id: 'CODE001' to be 'Alarms' and id: 'CODE002' to be 'Alerts' and id: 'CODE003' to be 'Recipes'
i will use currentValues: {
  CODE001: 'Alarms',
  CODE002: 'Alerts',
  CODE003: 'Recipes'
}

if i want to add a new key based on old values (i want to keep the old `id` key the same, but take that text, convert it and add
the new text to a new key i would add the option AddAsNewKey with the name of the key to add, like below...
i will use currentValues: {
  CODE001: 'Alarms',
  CODE002: 'Alerts',
  CODE003: 'Recipes',
  addAsNewKey: `id`
}
*/

  /* do you want to rename a key something else?  this will remove the old key from the object */
  convertKeys?: ProcessAlarmsSettingsPropsConvertKeys;
}

export const processAlarmsData = (
  data: ProcessAlarmsDataReturnProps,
  props?: ProcessAlarmsSettingsProps
): ProcessAlarmsDataReturnProps => {
  if (!data) return undefined;

  const x = (data || []).reduce((acc: Record<string, unknown>[], item) => {
    if (!props?.showHidden && item?.location === 'hidden') return acc;

    const obj = { ...item };

    if (obj?.type === '') obj.type = 'Undefined';
    if (obj?.code) obj.code = `${obj.code}`;

    let startTimeKey = props?.startTimeKey;
    let endTimeKey = props?.endTimeKey;
    let timeZone = props?.timeZone;

    if (startTimeKey) {
      if (!obj?.[startTimeKey]) {
        console.log('Error processing data:  startTimeKey does exist as a key in object.');
        acc = [obj, ...acc];
      }
    }

    if (endTimeKey) {
      if (!obj?.[endTimeKey]) {
        console.log(`Error processing data: endTimeKey does exist as a key in object.`);
        acc = [obj, ...acc];
      }
    }

    // convert to provided timezone if needed
    if ((startTimeKey && obj?.[startTimeKey]) || (endTimeKey && obj?.[endTimeKey])) {
      startTimeKey = startTimeKey as string;
      endTimeKey = endTimeKey as string;

      if (props?.timeZone) {
        // type as string
        timeZone = timeZone as string;
        // first check if the key exists, then convert to timezone and parse as Date object for manip
        if (obj[startTimeKey]) {
          obj[startTimeKey] = utcToZonedTime(parseISO(obj[startTimeKey] as string), timeZone);
        }
        // check if key exists in object, then convert
        if (obj[endTimeKey])
          obj[endTimeKey] = utcToZonedTime(parseISO(obj[endTimeKey] as string), timeZone);
      } else {
        // no timezone is present, convert to date object for consistency
        if (obj[startTimeKey]) obj[startTimeKey] = parseISO(obj[startTimeKey] as string);
        if (obj[endTimeKey]) obj[endTimeKey] = parseISO(obj[endTimeKey] as string);
      }

      if (props?.addDurationAsKey && obj[startTimeKey] && obj[endTimeKey])
        obj[props?.addDurationAsKey as string] = calculateDateObjectsDuration(
          obj[startTimeKey] as Date,
          obj[endTimeKey] as Date
        );
    }

    // check to see if adding the start of date is req
    // adds it as an ISO object
    if (props?.addDateAsKey && startTimeKey) {
      obj[props.addDateAsKey] = formatISO(startOfDay(obj[startTimeKey] as Date));
    }

    // convert back to ISO if requested
    if (props?.convertDatesToISO) {
      if (obj[startTimeKey as string])
        obj[startTimeKey as string] = formatISO(obj[startTimeKey as string] as Date);
      if (obj[endTimeKey as string])
        obj[endTimeKey as string] = formatISO(obj[endTimeKey as string] as Date);
    }

    if (props?.convertKeys)
      Object.keys(props?.convertKeys).map((dataKey) => {
        if (obj?.[dataKey] && props?.convertKeys?.[dataKey]) {
          const newDataKey = props?.convertKeys?.[dataKey]?.addAsNewKey;
          const renameDataKey = props?.convertKeys?.[dataKey]?.renameKeyTo as string;
          const convertedValue =
            props?.convertKeys?.[dataKey]?.[obj?.[dataKey] as string] || obj?.[dataKey];

          if (convertedValue) {
            if (newDataKey) obj[newDataKey as string] = convertedValue;
            else obj[dataKey] = convertedValue;
          }

          if (renameDataKey) {
            obj[renameDataKey] = obj?.[dataKey];
            delete obj?.[dataKey];
          }
        }
      });

    return (acc = [obj, ...acc]);
  }, []);

  return x;
};
/*
export interface SortByKeyProps {
  data?: Record<string, unknown>[];
  sortKeys?: Record<string, string>[];
  direction: string;
}

export const sortByKey = ({
  data,
  sortKeys,
  direction
}: SortByKeyProps): Record<string, unknown>[] | undefined => {

  const asc = direction === 'up' ? true : false;

  if (!data) return undefined;
  if (!sortKeys) return data;

  // make a copy of data to sory to not affect the origional array
  const newData = [...data].sort((a, b) => {

    if (sortKeys) {
      sortKeys.map(({ sortKey, direction }) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return (asc ? 1 : -1) * (valueA - valueB);
        }

        const strA = `${valueA}`;
        const strB = `${valueB}`;

        return (asc ? 1 : -1) * strA.localeCompare(strB);
      })
    }

  });

  return newData
};
*/
