import { ChartDataItemProps } from '../Charts.types';

// Use this function to convert raw data for use with a Pie Chart.
// returns [{x, y, lable}, {x, y, label}]
export const convertToChartData = (
  data: Record<string, unknown>[],
  groupKey: string
): ChartDataItemProps[] => {
  // Group the data by the specified key and count the number of occurrences of each group
  const groupedData = data.reduce((acc: Record<string, number>, obj: Record<string, unknown>) => {
    const id = obj[groupKey] as string;
    // If the group has not yet been seen, initialize its count to 0
    if (!acc[id]) acc = { ...acc, [id]: 0 };
    // Increment the count of the group
    acc[id] = acc[id] + 1;
    return acc;
  }, {});

  // Convert the grouped data to chart data
  const pieData: ChartDataItemProps[] = Object.entries(groupedData).reduce(
    (acc: ChartDataItemProps[], [id, val]) =>
      // Add the new chart data item to the array of chart data items
      (acc = [
        ...acc,
        { x: id as string, y: val as number, label: id, className: `pie-slice pie-slice--${id}` }
      ]),
    []
  );

  // Return the array of chart data items [{x, y, lable}, {x, y, label}]
  return pieData;
};

// use this function to convert raw data to Stacked Chart Data.
// Returns: {
//  group1: [{x, y, lable}, {x, y, label}],
//  group2: [{x, y, lable}, {x, y, label}]
// }
export const convertToStackedChartData = (
  data: Record<string, unknown>[],
  groupKey: string,
  itemKey?: string
): Record<string, ChartDataItemProps[]> => {
  if (!itemKey) return {};
  // Group the data by the specified group key and item key, and count the number of occurrences of each combination of group and item
  const groupedData = data.reduce(
    (acc: Record<string, Record<string, unknown>>, obj: Record<string, unknown>) => {
      const id = obj[groupKey] as string;
      const itemId = obj[itemKey] as string;

      // If the group has not yet been seen, initialize it with an empty object for its items
      if (!acc[id]) acc = { ...acc, [id]: {} };
      // If the item has not yet been seen for this group, initialize its count to 0
      if (!acc[id][itemId]) acc[id] = { ...acc[id], [itemId]: 0 };
      // Increment the count of the combination of group and item
      acc[id][itemId] = Number(acc[id][itemId]) + 1;
      return acc;
    },
    {}
  );

  // Convert the grouped data to stacked chart data
  return Object.entries(groupedData).reduce(
    (acc: Record<string, ChartDataItemProps[]>, [groupId, items]) => {
      // If the group has not yet been seen, initialize it with an empty array of chart data items
      if (!acc[groupId]) acc = { ...acc, [groupId]: [] };
      // Convert each combination of group and item to a chart data item and add it to the array of chart data items for the group
      Object.entries(items).map(
        ([itemId, values]) =>
          (acc[groupId] = [...acc[groupId], { x: itemId, y: values as number, label: groupId }])
      );
      return acc;
    },
    {}
  );
};

// use this code to calculate maxDomain on a stacked bar chart.  This determines the max height of the chart.
// (calculate the maximum Y-axis domain for a stacked chart)
export const calculateStackedMaxDomain = (
  data: Record<string, unknown>[],
  itemKey?: string
): number => {
  if (!itemKey) {
    console.log('ERROR: missing itemKey in calculateStackedMaxDomain');
    return 100;
  }
  // Create a counter object to count the number of occurrences of each item
  const counter: Record<string, number> = data.reduce((acc, item) => {
    const itemId = item[itemKey] as string;
    if (!acc[itemId]) acc = { ...acc, [itemId]: 0 };
    acc[itemId] = Number(acc[itemId]) + 1;
    return acc;
  }, {}) as Record<string, number>;

  // Find the maximum value in the counter object
  return Object.values(counter).reduce((acc, val) => {
    const v = Number(val);
    return (acc = v > acc ? v : acc);
  }, 0);
};

// generates a string array of categories for bar and stacked bar charts
export const generateCategoriesArray = (
  data: Record<string, unknown>[],
  categoryKey?: string
): string[] =>
  !categoryKey
    ? []
    : data
        .reduce((acc: string[], obj) => {
          const category = obj[categoryKey] as string;
          if (!acc.includes(category)) acc = [...acc, category];
          return acc;
        }, [])
        .sort();
