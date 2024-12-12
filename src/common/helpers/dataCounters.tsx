export const calculateDataKeyTotals = (
  // data to convert to chart data
  data: Record<string, unknown>[],
  // this is needed to know how we're grouping the data
  // at the miminum, this script will calculate the number of occurrences of each group
  groupKey: string,
  keys?: {
    // add a value key if you want to do some math on the values
    // will return the total and average of the values along
    valueKey?: string;
  }
): Record<string, unknown> => {
  // Group the data by the specified key and count the number of occurrences of each group
  const groupedData: Record<string, unknown> = data.reduce((acc, obj) => {
    // get the group this item is part of
    const group = obj[groupKey] as string;
    // start new counter object
    if (!acc[group])
      acc = {
        [group]: {
          // the number of occurrences of this group
          count: 0,
          // the total amount of the values of valueKeys (if provided)
          total: 0,
          // the average amount of the values of valueKeys (if provided)
          average: 0,
          // add the groupKey to the object for reference
          groupKey: groupKey
        },
        ...acc
      };

    // setup a new group object.  this was done to pass TS errors
    const newG = acc[group] as Record<string, unknown>;
    // add to the counter
    newG.count = Number(newG.count) + 1;
    // check if there is a value or we're just couting the occurrences of this group
    // add value key for reference if provided
    if (keys?.valueKey) {
      // get value if we're given a valueKey to total up the amounts
      const val = obj?.[keys?.valueKey as string] as number;
      newG.valueKey = keys.valueKey;
      newG.total = Number(newG.total) + val;
      newG.average = Number(newG.total) / Number(newG.count);
    } else {
      delete newG.average;
      delete newG.total;
    }
    // replace with new totals
    acc[group] = newG;

    // return the new data object array
    return acc;
  }, {});

  return groupedData;
};

export const roundToTenth = (num: number): number => Math.round(num * 10) / 10;
