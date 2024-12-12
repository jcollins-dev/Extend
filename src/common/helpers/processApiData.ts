import { differenceInSeconds, parseISO, format } from 'date-fns';
import { addTimeZoneToUTCTimeStamp, getDurationISOTimeStamps } from './dateAndTimeHelpers';

export type ProcessApiDataReturnProps = Record<string, unknown>[] | undefined;

export const calculateDateObjectsDuration = (start: Date, end: Date): string | undefined => {
  const duration = differenceInSeconds(end, start);
  const formattedDuration = format(new Date(0, 0, 0, 0, 0, duration), 'H:mm:ss');
  return formattedDuration;
};

export const calculateDuration = (start: string, end: string): string | undefined => {
  const newStart = parseISO(start);
  const newEnd = parseISO(end);

  if (!newStart || !newEnd) return undefined;

  const duration = differenceInSeconds(newEnd, newStart);
  const formattedDuration = format(new Date(0, 0, 0, 0, 0, duration), 'H:mm:ss');

  return formattedDuration;
};

export type ProcessApiSettingsPropsConvertKeys = Record<string, Record<string, string>>;

export interface ProcessApiSettingsProps {
  /* do you want to add a new key `date` that will have only the date, based on start time to this object?
  the date will be iso formatted the same way the start time string is formatted, but will only have the 
  year month and day */
  addDateAsKey?: string;
  /* gets the difference between start and end time and adds it to a specified key to the object in pre-formatted string */
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
  /** for troubleshooting console.logs, this adds a string to the message so we know what function is calling this */
  caller?: string;
  /** include origional object data */
  includeData?: boolean;
  /** don't inclide keys with values */
  exclude?: Record<string, unknown[]>;
  /** don't inclide keys with values */
  excludeKeys?: string[];
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
  renameKeys?: Record<string, string>;
  /* do you want to rename a key something else?  this will remove the old key from the object */
  convertKeys?: ProcessApiSettingsPropsConvertKeys;
}

export const processApiData = (
  data: ProcessApiDataReturnProps,
  props?: ProcessApiSettingsProps
): ProcessApiDataReturnProps => {
  if (!data) return undefined;

  // start a new array to return that is processed
  // based on the props passed in
  const x = (data || []).reduce((acc: Record<string, unknown>[], item) => {
    // if showHidden is false, and the item is hidden, skip it
    // i forget why this is needed
    if (!props?.showHidden && item?.location === 'hidden') return acc;

    // make a copy of the item to not affect the origional array
    const obj = { ...item };

    // break down props to make it easier to read and to pass TS checks
    let startTimeKey = props?.startTimeKey;
    let endTimeKey = props?.endTimeKey;
    let timeZone = props?.timeZone;

    // check if you're excluding keys with values
    if (props?.exclude) {
      let excluded = false;
      Object.entries(props.exclude).map(([key, vals]) => {
        if (obj[key] && vals.includes(obj[key])) {
          excluded = true;
        }
      });
      if (excluded) return acc;
    }

    if (startTimeKey) {
      if (!obj?.[startTimeKey]) {
        console.log(
          `Error processing data:  startTimeKey: ${startTimeKey} does exist as a key in object.`
        );
      }
    }

    if (endTimeKey) {
      if (!obj?.[endTimeKey]) {
        console.log(
          `Error processing data: endTimeKey: ${endTimeKey} does exist as a key in object.`
        );
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
          // keep for troubleshooting.  this adds the origional timestamp, before it was converted to TZ
          // obj[`${startTimeKey}Raw`] = obj[startTimeKey];

          obj[startTimeKey] = addTimeZoneToUTCTimeStamp(
            obj[startTimeKey] as string,
            timeZone as string
          );

          // keep for troubleshooting.  this adds the origional timestamp, before it was converted to TZ
          // obj[`${startTimeKey}UTC`] = convertToUTCTimeStamp(obj[startTimeKey] as string);
        }
        // check if key exists in object, then convert
        if (obj?.[endTimeKey]) {
          obj[endTimeKey] = addTimeZoneToUTCTimeStamp(
            obj[endTimeKey] as string,
            timeZone as string
          );
          // keep for troubleshooting.  this adds the origional timestamp, before it was converted to TZ
          // obj[`${endTimeKey}Raw`] = convertToUTCTimeStamp(obj[endTimeKey] as string);
        }
      }

      if (obj[startTimeKey] && obj[endTimeKey] && props?.addDurationAsKey) {
        obj[props?.addDurationAsKey as string] = getDurationISOTimeStamps(
          obj[endTimeKey] as string,
          obj[startTimeKey] as string
        );
      }

      // check to see if adding the start of date is req
      // adds it as an ISO object
      if (props?.addDateAsKey && obj?.[startTimeKey]) {
        const startDate = (obj[startTimeKey] as string).split('T')[0];
        obj[props.addDateAsKey] = startDate;
      }
    }

    if (props?.convertKeys) {
      Object.entries(props.convertKeys).map(([convertKey, convertVals]) => {
        if (obj?.[convertKey]) {
          const oldValue = obj[convertKey] as string;
          const newValue = convertVals[oldValue] as string;
          obj[convertKey] = newValue;
        }
      });
    }

    if (props?.excludeKeys) {
      props.excludeKeys.map((key) => {
        delete obj[key];
      });
    }

    /*
    for (const dataKey of Object.keys(props?.convertKeys)) {
      console.log({dataKey})
      if (obj?.[dataKey] && props?.convertKeys?.[dataKey]) {
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
      }
    }
    */

    return acc.push(obj), acc;
  }, []);

  return x;
};
