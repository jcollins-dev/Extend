// 3rd party
import React, { useMemo } from 'react';
import { AlarmChartsAndDataFilterProps } from './AlarmChartsAndDataFilter';

// Elements
import { baseClass } from './AlarmChartsAndDataFilter.elements';

// Compoenents
import { WidgetUi } from 'components';
import { StackedBarChartDataProps, ChartDataItemProps } from '../ChartsV2';
import { useFilterSelected } from '../FilterSelected';
import {
  convertToChartData,
  convertToStackedChartData,
  generateCategoriesArray,
  calculateStackedMaxDomain,
  StackedBarChart,
  PieChart
} from '../ChartsV2';

interface ChartAreaProps extends AlarmChartsAndDataFilterProps {
  chartType: string;
  title?: string;
  hasLegend?: boolean;
  tooltipText?: string;
}

export interface FilterSelectedItemsProps {
  data?: Record<string, unknown>[];
  selected?: Record<string, string[]>;
}
// const filterSelectedItems = ({
//   data,
//   selected
// }: FilterSelectedItemsProps): Record<string, unknown>[] | undefined => {
//   if (!data) return undefined;
//   else if (!selected) return data;
//   else
//     return data.reduce((acc: Record<string, unknown>[], obj) => {
//       Object.entries(obj).map(([key, val]) => {
//         key = `${key}`;
//         val = `${val}`;
//         if (selected[key]?.includes(val as string)) {
//           acc = [obj, ...acc];
//         }
//       });
//       return acc;
//     }, []);
// };

const Chart = ({
  title,
  data,
  groupKey,
  itemKey,
  chartType,
  hasLegend,
  tooltipText
}: ChartAreaProps) => {
  if (!data || !groupKey || !chartType) return <></>;

  const dataCache = useMemo(() => data, [data]);
  const totalDataPoints = dataCache.length;

  const [selected, handleSelect] = useFilterSelected();

  //const filteredData = filterSelectedItems({ data: dataCache, selected });

  const chartData: StackedBarChartDataProps | ChartDataItemProps[] | undefined = !dataCache
    ? undefined
    : chartType === `pie`
    ? convertToChartData(dataCache, groupKey)
    : chartType === `stacked-bar`
    ? convertToStackedChartData(dataCache, groupKey, itemKey)
    : undefined;

  if (!chartData) return <>problem getting chart data</>;

  const handlePieSliceClick = (value: string, id?: string) => {
    console.log(id);
    handleSelect(selected?.[itemKey] ? `set` : `toggle`, { [groupKey]: value });
  };

  const handleBarChartClick = (group: string, item: string) => {
    if (item && itemKey) handleSelect('set', { [itemKey]: item, [groupKey]: group });
  };

  const categories = !itemKey ? undefined : generateCategoriesArray(data, itemKey);

  return (
    <WidgetUi title={title} className={`${baseClass}--${title?.replace(/\s/g, '-')}`}>
      {chartType === `pie` && (
        <PieChart
          {...{
            data: chartData as ChartDataItemProps[],
            handleClick: (groupId: string) => handlePieSliceClick(groupId),
            selected: selected?.[groupKey],
            totalDataPoints,
            hasLegend,
            tooltipText
          }}
        />
      )}
      {chartType === `stacked-bar` && (
        <StackedBarChart
          {...{
            data: chartData as StackedBarChartDataProps,
            handleClick: handleBarChartClick,
            // generates categories to stack recipes by date in the stacked bar chart
            categories: generateCategoriesArray(data, itemKey),
            tickMarks: categories,
            // gets the max number of values per column, this to get the max containerHeight of each bar column
            maxDomain: calculateStackedMaxDomain(data, itemKey),
            //checkIfSelected: (item: string, group: string) => checkIfSelected(item, group)
            isDoughnut: true,
            checkIfSelected: (group: string, item: string) => {
              // no items selected, return true so the bar is visible
              if (!selected) return true;
              else {
                // we have selected items, but this bar is not in any of them
                if (!selected?.[groupKey] && !selected?.[itemKey]) return false;
                // one or more element of this bar is selected
                else {
                  // the group is selected
                  if (selected?.[groupKey]) {
                    // check if item is also selected
                    if (selected?.[itemKey]) {
                      // this item is selected, both group and item are present
                      if (
                        selected?.[itemKey].includes(item) &&
                        selected?.[groupKey].includes(group)
                      )
                        return true;
                      else return false;
                    } else if (selected?.[groupKey].includes(group)) return true;
                    // check to see an item is selected
                    //if (selected?.[itemKey])
                  }
                  // no group is selected, check if item is
                  else {
                    if (selected?.[itemKey].includes(item)) return true;
                    else return false;
                  }
                }
              }

              return false;
              //else if (selected?.[groupKey]?.includes(group) && selected?.[itemKey]?.includes(item)) return true
              //else return false
              //if (selected?.[groupKey]?.includes(group) && selected?.[itemKey])
            },
            selected,
            groupKey,
            itemKey,
            hasLegend,
            totalDataPoints,
            tooltipText
          }}
        />
      )}
    </WidgetUi>
  );
};

export const PieChartsArea = ({ data, charts }: AlarmChartsAndDataFilterProps): JSX.Element => {
  if (!data || !charts) return <></>;
  return (
    <>
      {charts.map((chartSettings) => (
        <Chart {...{ data, ...chartSettings }} key={chartSettings.title} />
      ))}
    </>
  );
};
