//import { ChartDataItemProps } from '../Charts.types';
import { DateRangeProps } from 'components/StyledUi/DateRange';
import { eachDayOfInterval, formatISO } from 'date-fns';
import { parseISO } from 'date-fns';

type ChartDataItemProps = Record<string, unknown>;

/**
 * Converts raw data into chart data items, grouped by a specified key,
 * and optionally calculates the percentage values based on the count.
 *
 * @param data The array of raw data objects.
 * @param groupKey The key to group the data by.
 * @param props Additional properties for configuration.
 * @param props.categoryKey The key representing the category of the data.
 * @param props.calculatePercents Whether to calculate percentage values.
 * @returns An array of chart data items.
 */
export const convertToChartData = (
  data: Record<string, unknown>[],
  groupKey: string,
  props?: {
    calculatePercents?: boolean;
    // do you want to add the groupKey to the chart data?
    includeGroupKey?: boolean;
    // do you want to add the categoryKey to the chart data?
    includeCategoryKey?: string;
    // do you want to add the category to the chart data?
    includeCategory?: boolean;
    // do you want to add the group to the chart data?
    includeGroup?: boolean;
    // do you want to add a key 'label' with x value?
    addLabelKey?: boolean;
  }
): ChartDataItemProps[] => {
  // Group the data by the specified key and count the number of occurrences of each group
  const groupedData = data.reduce((acc: Record<string, unknown>, obj: Record<string, unknown>) => {
    const id = obj[groupKey] as string;
    // If the group has not yet been seen, initialize its count to 0
    if (!acc[id]) acc = { ...acc, [id]: 0 };
    // Increment the count of the group
    acc[id] = Number(acc[id]) + 1;
    return acc;
  }, {});

  // Convert the grouped data to chart data
  const chartData = Object.entries(groupedData).reduce((acc: ChartDataItemProps[], [id, val]) => {
    // Add the new chart data item to the array of chart data items
    const newItem: ChartDataItemProps = {
      x: id,
      y: val
    };

    // check incoming props and add if required
    if (props?.addLabelKey) newItem.label = id;

    if (props?.includeGroupKey) newItem.groupKey = props?.includeGroupKey;

    return [...acc, newItem];
  }, []);

  // Calculate the percentage values if requested
  if (props?.calculatePercents) {
    return calculatePercentages(chartData, 'y', 'x');
  } else {
    return chartData;
  }
};

// use this function to convert raw data to Stacked Chart Data.
// Returns: {
//  group1: [{x, y, lable}, {x, y, label}],
//  group2: [{x, y, lable}, {x, y, label}]
// }
export type ConvertToStackedChartDataReturnProps = Record<string, Record<string, unknown>[]>;

export const convertToStackedChartData = (
  data: Record<string, unknown>[],
  // groupKey is the main grouping of the bars, which means the date is first grouped by the values of groupKey (ex: recipeType)
  groupKey: string,
  // categoryKey is what is used to stack the bars, and also relates to the label (tick marks) that are at the bottom of the chart (ex: date)
  categoryKey: string,

  props?: {
    // do you want to add the groupKey to the chart data?
    includeGroupKey?: boolean;
    // do you want to add the categoryKey to the chart data?
    includeCategoryKey?: boolean;
    // do you want to add the category to the chart data?
    includeCategory?: boolean;
    // do you want to add the group to the chart data?
    includeGroup?: boolean;
    // do you want to add a key 'label' with x value?
    addLabelKey?: boolean;
    convertToDate?: boolean;
  }
): Record<string, Record<string, unknown>[]> | undefined => {
  if (!data) return undefined;
  // Group the data by the specified group key and item key, and count the number of occurrences of each combination of group and item
  const groupedData = data.reduce(
    (acc: Record<string, Record<string, unknown>>, obj: Record<string, unknown>) => {
      const id = obj?.[groupKey] ? (obj?.[groupKey] as string) : undefined;
      const cat = obj?.[categoryKey] ? (obj?.[categoryKey] as string) : undefined;

      if (!id || !cat) return acc;
      // If the group has not yet been seen, initialize it with an empty object for its items
      if (!acc[id]) acc = { ...acc, [id]: {} };
      // If the item has not yet been seen for this group, initialize its count to 0
      if (!acc[id][cat]) acc[id] = { ...acc[id], [cat]: 0 };
      // Increment the count of the combination of group and item
      acc[id][cat] = Number(acc[id][cat]) + 1;

      return acc;
    },
    {}
  );

  // Convert the grouped data to stacked chart data
  const chartData = Object.entries(groupedData).reduce(
    (acc: Record<string, ChartDataItemProps[]>, [groupId, items]) => {
      // If the group has not yet been seen, initialize it with an empty array of chart data items
      if (!acc[groupId]) acc = { ...acc, [groupId]: [] };

      Object.entries(items).map(([category, values]) => {
        let newItem: Record<string, unknown> = {
          x: category,
          y: values as number
        };

        if (props?.includeCategoryKey) newItem = { ...newItem, categoryKey };
        if (props?.includeCategory) newItem = { ...newItem, category };
        if (props?.includeGroupKey) newItem.groupKey = groupKey;
        if (props?.includeGroup) newItem.group = groupId;
        if (props?.convertToDate && newItem.x) newItem.x = parseISO(newItem.x as string);

        acc[groupId] = [...acc[groupId], newItem];
      });

      return acc;
    },
    {}
  );
  return chartData;
};

// use this code to calculate maxDomain on a stacked bar chart.  This determines the max height of the chart.
// (calculate the maximum Y-axis domain for a stacked chart)
export const calculateStackedMaxDomain = (
  data: Record<string, unknown>[],
  categoryKey?: string
): number => {
  if (!categoryKey) {
    console.log('ERROR: missing categoryKey in calculateStackedMaxDomain');
    return 100;
  }
  // Create a counter object to count the number of occurrences of each item
  const counter: Record<string, number> = data.reduce((acc, item) => {
    const itemId = item[categoryKey] as string;
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

export const generateDateRangeCategories = (props?: DateRangeProps): string[] | undefined =>
  !props
    ? undefined
    : eachDayOfInterval({ start: props.startTime, end: props.endTime }).map((timestamp) =>
        formatISO(timestamp, { representation: 'date' })
      );

/*DELETE: export const generateDateRangeBarChartData = (groupKey: string, categoryKey: string, dateRange: DateRangeProps, data?: Record<string, unknown>[]): Record<string, Record<string, unknown>[]> | undefined => {
  if (!data) return undefined

  const chartData = convertToStackedChartData(data, groupKey, categoryKey)
  const dateCats = generateDateRangeCategories(dateRange)

  const newData = { ...chartData }

  Object.entries(newData).map(([k, barsData]) => {
    const dates = barsData.reduce((acc, { x }) => {
      const subs = `${x}`.substring(0, 10)
      acc = { ...acc, [subs as string]: true }
      return acc
    })

    dateCats.map(cat => {
      const subs = cat.substring(0, 10)
      if (!dates[subs]) newData?.[k].push({
        x: cat,
        y: 0
      })
    })
  })

  return newData
}*/

// generates a string array of categories for bar and stacked bar charts
export const generateCategoriesArray = (
  data: Record<string, unknown>[],
  categoryKey: string
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

export interface GenerateCategoriesFromStackedDataPropsOptions {
  categoryKey: string;
  isDateCategory?: boolean;
  formatCategory?: (obj: Record<string, unknown>) => void;
}
export const generateCategoriesFromStackedData = (
  data: ConvertToStackedChartDataReturnProps,
  props: GenerateCategoriesFromStackedDataPropsOptions
): string[] | undefined => {
  if (!data || !props || !props?.categoryKey) {
    console.log(
      'Error generating categories in generateCategoriesFromStackedData:  missing data or props'
    );
    return undefined;
  }

  return [`categories`];
};

/**
 * Calculates the percentage of each object in the given data array
 * based on the specified value key. Ensures that the sum of all
 * percentage values is equal to 100.
 *
 * @param data The array of objects to calculate percentages for.
 * @param valueKey The key to retrieve the value from each object.
 * @returns A new array of objects with the added 'percent' property.
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
    return { ...obj, [valueKey]: percent, count: obj[valueKey] };
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
