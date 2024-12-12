import { differenceInSeconds, parseISO, format, formatISO } from 'date-fns';

export type ProcessAlarmsDataReturnProps = Record<string, unknown>[] | undefined;

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
  /* do you want to covert key values to a new value, or change the name of a key? if so, follow the format below
  convertValues: {
    // keyToConvert: this value will correspond the object key you want to change.
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
  convertKeys?: ProcessAlarmsSettingsPropsConvertKeys;
}

export const processAlarmsData = (
  data: ProcessAlarmsDataReturnProps,
  props?: ProcessAlarmsSettingsProps
): ProcessAlarmsDataReturnProps => {
  if (!data) return undefined;

  const x = (data || []).reduce((acc: Record<string, unknown>[], item) => {
    if (!props?.showHidden && item?.location === 'hidden') return acc;

    let obj = { ...item };

    if (obj?.type === '') obj.type = 'Undefined';
    if (obj?.code) obj.code = `${obj.code}`;

    const startTimeKey = props?.startTimeKey;
    const endTimeKey = props?.endTimeKey;

    if (startTimeKey && endTimeKey) {
      if (props?.addDurationAsKey && obj?.[startTimeKey as string] && obj?.[endTimeKey as string])
        obj = {
          ...obj,
          [props.addDurationAsKey]: calculateDuration(
            obj[startTimeKey] as string,
            obj[endTimeKey] as string
          )
        };

      if (props?.addDateAsKey) {
        const date = parseISO(obj?.[startTimeKey] as string);
        obj[props.addDateAsKey] = formatISO(date, { representation: 'date' });
      }
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

export interface SortByKeyProps {
  data?: Record<string, unknown>[];
  sortKey?: string;
  direction: string;
}

export const sortByKey = ({
  data,
  sortKey,
  direction
}: SortByKeyProps): Record<string, unknown>[] | undefined => {
  const asc = direction === 'up' ? true : false;

  if (!data) return undefined;
  if (!sortKey) return data;

  // make a copy of data to sory to not affect the origional array
  const newData = [...data];

  return newData.sort((a, b) => {
    const valueA = a[sortKey];
    const valueB = b[sortKey];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (asc ? 1 : -1) * (valueA - valueB);
    }

    const strA = `${valueA}`;
    const strB = `${valueB}`;

    return (asc ? 1 : -1) * strA.localeCompare(strB);
  });
};
