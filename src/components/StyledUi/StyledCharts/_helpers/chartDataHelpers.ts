import { StyledChartsPropsDataItem, StyledChartsPropsGroupKey } from '../StyledCharts.types';

export const convertToChartData = (
  data: StyledChartsPropsDataItem[],
  groupKey: StyledChartsPropsGroupKey,
  props?: {
    calculatePercents?: boolean;
    // do you want to add a key 'label' with x value?
    addLabelKey?: boolean;
    // is this chart filtered?  if it is we need to the key to know which group this item is being
    // filtered by and add the keys and values to the data for use with chart
    filteredByKey?: string;
    // keys to add to the data object, the values of these keys should be the same per group.
    addKeys?: string[];
  }
): Record<string, unknown>[] => {
  // Group the data by the specified key and count the number of occurrences of each group
  const groupedData = data.reduce(
    (acc: Record<string, Record<string, unknown>>, obj: Record<string, unknown>) => {
      const id = obj[groupKey] as string;
      // If the group has not yet been seen, initialize its count to 0
      if (!acc[id])
        acc = {
          ...acc,
          [id]: {
            y: 0,
            x: id,
            [groupKey]: obj[groupKey],
            groupKey,
            ...obj
          }
        };

      if (props?.filteredByKey)
        acc[id] = {
          ...acc[id],
          filterGroup: obj[props.filteredByKey],
          filteredByKey: props.filteredByKey
        };
      // Increment the count of the group
      acc[id].y = Number(acc[id].y) + 1;
      return acc;
    },
    {}
  );

  const chartData = Object.values(groupedData);

  // Calculate the percentage values if requested
  if (props?.calculatePercents) {
    return calculatePercentages(chartData, 'y', 'percent');
  } else {
    return chartData;
  }
};

/**
 * Calculates the percentage of each object in the given data array
 * based on the specified value key. Ensures that the sum of all
 * percentage values is equal to 100.
 */
const calculatePercentages = (
  data: Record<string, unknown>[],
  valueKey: string,
  labelKey: string
): Record<string, unknown>[] => {
  // Calculate the total value by summing up the numeric values

  const total = data.reduce((sum, obj) => sum + Number(obj[valueKey] || 0), 0);

  if (labelKey === 'test') {
    // need label key soon.  please keep this for components using this to pass TS
    console.log('labelKey not in use', { labelKey });
  }

  // Calculate the percentage for each object in the data array
  const newData = [...data].map((obj) => {
    const value = Number(obj[valueKey]) || 0;
    const percent = Math.round((value / total) * 100);
    return { ...obj, [valueKey]: percent, count: value };
  });

  // Calculate the sum of all percentage values
  const percentSum = newData.reduce((sum, obj) => sum + Number(obj[valueKey]), 0);

  // Adjust the percentage of the last object to ensure the sum is 100
  if (newData.length > 0) {
    const lastObj = newData[newData.length - 1];
    Number(((lastObj[valueKey] as number) -= percentSum - 100));
  }

  return newData;
};
