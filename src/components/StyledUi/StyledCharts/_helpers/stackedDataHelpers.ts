// use this function to convert raw data to Stacked Chart Data.
// Returns: {
//  group1: [{x, y, lable}, {x, y, label}],
//  group2: [{x, y, lable}, {x, y, label}]
// }
import { eachDayOfInterval, format, parseISO } from 'date-fns';

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
    // do you want to convert the x value to a date?
    convertToDate?: boolean;
    // what filters keys does this chart use?  this will add the kay/value item to the bar data item for use with
    // handlers and tooltips and labels
    filteredByKeys?: string[];
  }
): Record<string, Record<string, unknown>[]> | undefined => {
  // if there is no data then return undefined
  if (!data) return undefined;
  // Group the data by the specified group key and item key, and count the number of occurrences of each combination of group and item
  const groupedData = data.reduce(
    (
      acc: Record<string, Record<string, Record<string, unknown>>>,
      obj: Record<string, unknown>
    ) => {
      const group = obj?.[groupKey] ? (obj?.[groupKey] as string) : undefined;
      const cat = obj?.[categoryKey] ? (obj?.[categoryKey] as string) : undefined;

      if (!group || !cat) return acc;

      // If the group has not yet been seen, initialize it with an empty object for its items
      if (!acc[group]) acc = { [group]: {}, ...acc };
      if (!acc[group][cat])
        acc[group] = {
          [cat]: {
            [groupKey]: group,
            groupKey,
            [categoryKey]: cat,
            categoryKey,
            ...obj
          },
          ...acc[group]
        };

      if (props?.filteredByKeys) {
        props.filteredByKeys.map((key) => {
          if (obj[key]) acc[group][cat] = { [key]: obj[key] as string, ...acc[group][cat] };
        });
      }

      if (!acc[group][cat].count) acc[group][cat] = { count: 0, ...acc[group][cat] };

      acc[group][cat].count = Number(acc[group][cat].count) + 1;

      return acc;
    },
    {}
  );

  // Convert the grouped data to stacked chart data
  const chartData = Object.entries(groupedData).reduce(
    (acc: Record<string, Record<string, unknown>[]>, [group, items]) => {
      // If the group has not yet been seen, initialize it with an empty array of chart data items
      if (!acc[group]) acc = { [group]: [], ...acc };

      Object.entries(items).map(([category, values]) => {
        const newItem: Record<string, unknown> = {
          x: category,
          y: values.count as number,
          ...values
        };

        acc[group] = [newItem, ...acc[group]];
      });

      return acc;
    },
    {}
  );
  console.log({ chartData });
  return chartData;
};

export const calculateStackedMaxDomain = (
  data?: Record<string, Record<string, unknown>[]>
): number => {
  let max = 0;
  let groups: Record<string, Record<string, number>> | undefined = undefined;

  if (!data) return max;

  Object.entries(data).map(([group, items]) => {
    items.map((val: Record<string, unknown>) => {
      if (!groups?.[group as string]) groups = { ...groups, [group]: {} };
      if (!groups[group as string]?.[val.x as string])
        groups[group] = { ...groups[group], [val.x as string]: 0 };
      if (Number(val.y) > groups[group as string]?.[val.x as string])
        groups[group as string][val.x as string] = val.y as number;
    });
  });

  if (groups) {
    const groupItemsTotals = Object.values(groups).reduce((acc: Record<string, number>, items) => {
      Object.entries(items as Record<string, number>).map(([id, val]) => {
        if (!acc[id as string]) acc = { ...acc, [id]: val };
        else acc[id] = acc[id] + val;
      });
      return acc;
    }, {});

    Object.values(groupItemsTotals).map((val: number) => {
      if (val > max) max = val;
    });
  }

  if (max === 0) max = 500;

  return max;
};

export const calculateBarDomainPadding = (
  width: number,
  height: number,
  count: number
): number[] => {
  let domainPadding = [20, 0];

  if (width && height && count) {
    domainPadding = [Math.round(width / count / 2), 0];
  }

  return domainPadding;
};

// Generate an array of dates between the start and end dates
export const generateDateRangeCategories = (
  data?: Record<string, Record<string, unknown>[]>,
  range?: string[]
): string[] => {
  if (!data) return [];

  let dates: string[] = range || [];

  if (!range) {
    Object.values(data).forEach((group: Record<string, unknown>[]) => {
      group.forEach((item) => {
        const date = (item?.date as string) || (item.x as string);
        if (!dates.includes(date)) dates.push(date);
      });
    });

    if (dates.length < 2) return [];
    // sort the dates from start to finish
  }

  dates = dates.sort();

  // get the first date and last date based on sorted data
  const start = dates[0] as string;
  const end = dates[dates.length - 1] as string;

  // this generates an array of dates between the start and end dates in date format
  const datesArray = eachDayOfInterval({ start: parseISO(start), end: parseISO(end) });

  // this formats the dates array to be in the same format as the date data in the chart data
  return datesArray.map((date) => format(date, 'yyyy-MM-dd'));
};
