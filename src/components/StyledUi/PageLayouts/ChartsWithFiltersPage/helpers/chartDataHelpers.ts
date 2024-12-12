//import { ChartDataItemProps } from '../Charts.types';
import { DateRangeProps } from 'components/StyledUi/DateRange';
import { eachDayOfInterval, formatISO, startOfDay, endOfDay } from 'date-fns';
import { ChartPropsData } from '../components';
type ChartDataItemProps = Record<string, unknown>;

// Use this function to convert raw data for use with a Pie Chart.
// returns [{x, y, lable}, {x, y, label}]
export const convertToChartData = (
  data: Record<string, unknown>[],
  groupKey: string,
  categoryKey?: string
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
  const pieData: ChartDataItemProps[] = Object.entries(groupedData).reduce(
    (acc: ChartDataItemProps[], [id, val]) =>
      // Add the new chart data item to the array of chart data items
      (acc = [...acc, { x: id, y: val, label: id, groupKey, categoryKey, group: id }]),
    []
  );

  return pieData;
};

// use this function to convert raw data to Stacked Chart Data.
// Returns: {
//  group1: [{x, y, lable}, {x, y, label}],
//  group2: [{x, y, lable}, {x, y, label}]
// }
export type ConvertToStackedChartDataReturnProps = Record<string, Record<string, unknown>[]>;

export const convertToStackedChartData = (
  data: ChartPropsData,
  groupKey: string,
  categoryKey: string
): Record<string, Record<string, unknown>[]> => {
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
      //  console.log({ id, cat, acc })
      return acc;
    },
    {}
  );

  // Convert the grouped data to stacked chart data
  const chartData = Object.entries(groupedData).reduce(
    (acc: Record<string, ChartDataItemProps[]>, [groupId, items]) => {
      // If the group has not yet been seen, initialize it with an empty array of chart data items
      if (!acc[groupId]) acc = { ...acc, [groupId]: [] };

      Object.entries(items).map(
        ([category, values]) =>
          (acc[groupId] = [
            ...acc[groupId],
            { x: category, y: values as number, group: groupId, category, groupKey, categoryKey }
          ])
      );

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

export interface GenerateDateRangeCategoriesProps extends DateRangeProps {
  timeZone?: string;
}
export const generateDateRangeCategories = ({
  startTime,
  endTime
}: GenerateDateRangeCategoriesProps): string[] =>
  eachDayOfInterval({ start: startTime, end: endTime }).map((timestamp) => formatISO(timestamp));

export const generateDateRangeCategoriesAsDate = ({
  startTime,
  endTime
}: GenerateDateRangeCategoriesProps): Date[] => {
  const start = startOfDay(startTime);
  const end = endOfDay(endTime);
  return eachDayOfInterval({ start, end }).map((timestamp) => timestamp);
};
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

export const calculatePercentages = (
  data: Record<string, unknown>[],
  categoryKey: string
): Record<string, unknown> | undefined => {
  const chartData = data && convertToChartData(data, categoryKey);

  const totals = chartData?.reduce((sum, { y }) => sum + Number(y), 0);

  const percents =
    totals &&
    chartData?.reduce(
      (acc, { x, y }, index, arr) => {
        const percent = (Number(y) / totals) * 100;
        const roundedPercent =
          index === arr.length - 1 ? 100 - Number(acc.total) : Math.round(percent);
        return { ...acc, [x as string]: roundedPercent, total: Number(acc.total) + roundedPercent };
      },
      { total: 0 }
    );

  if (percents && percents?.total) delete percents?.total;

  return percents ? percents : undefined;
};
