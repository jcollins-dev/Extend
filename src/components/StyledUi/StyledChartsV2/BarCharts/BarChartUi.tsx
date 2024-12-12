import React, { ReactNode, useMemo } from 'react';
import { StyledBarChart } from './StyledBarChart';
import { WidgetUi } from 'components/StyledUi/WidgetUi';
import { convertToChartData, convertToStackedChartData } from '../helpers';
import { BarChartUiContainer, baseClass } from './BarChartUi.elements';
import { UseStyledChartProps } from '../hooks';
import { useFilterSelected } from 'components/StyledUi/FilterSelected';
import { StyledBarChartGrouped } from './StyledBarChartGrouped';

const checkSelected = (
  datum: Record<string, unknown>,
  groupKey: string,
  categoryKey: string,
  options?: {
    selected?: Record<string, string[]>;
    filteredByKeys?: string[];
  }
): boolean => {
  const { selected, filteredByKeys } = options || {};
  // nothing is selected, so return early
  if (!selected) return true;
  // this items group and category is not selected, neither is it's filtered by keys entry return early
  if (!selected?.[groupKey] && !selected?.[categoryKey] && !filteredByKeys) return false;
  // set up group and category pass / faill tests
  let groupPass = false;
  let categoryPass = false;

  // check if this items group is selected
  selected?.[groupKey]?.forEach((val: string) => {
    if (val === datum[groupKey]) groupPass = true;
  });

  // check if a category is selected, if not, pass
  if (!selected?.[categoryKey]) {
    categoryPass = true;
  } else {
    // check if this items category is selected
    selected?.[categoryKey]?.forEach((val: string) => {
      if (val === datum[categoryKey]) categoryPass = true;
    });
  }

  return groupPass && categoryPass ? true : false;
};

const handleBarClick = (
  datum: Record<string, unknown>,
  groupKey: string,
  categoryKey: string,
  handleSelect: (x: string, sel?: Record<string, string | string[]>) => void,
  options?: {
    selected?: Record<string, string[]>;
    filteredByKeys?: string[];
  }
): void => {
  // for ts
  const selectedCat = datum[categoryKey] as string;
  // const selectedGroup = datum[groupKey] as string;

  const newSelected = {
    [categoryKey]: selectedCat,
    // [groupKey]: selectedGroup,
    ...options?.selected
  };
  //newSelect = newSelect
  if (newSelected.searchTerm) delete newSelected.searchTerm;

  return handleSelect('toggle', newSelected);

  /*
  saving this for later, this will be used
  const { selected, filteredByKeys } = options || {};
 
  // define new object to pass to handleSelect
  let selectObj: Record<string, string> = {
    // check for x, if x isn't there, check for groupKey (legend passed object k as groupKey)
    [groupKey]: (datum.x as string) || (datum[groupKey] as string),
    [categoryKey]: datum[categoryKey] as string
  };
 
  if (filteredByKeys) {
    const parentGroupKey = filteredByKeys?.[0];
    // add the parent group key to the select object to make sure
    // the parent filter is selected
    selectObj = { ...selectObj, [parentGroupKey]: datum?.[parentGroupKey] as string };
  }
 
  // nothing is selected, so select this group and item
  if (!selected) {
    return handleSelect('set', selectObj);
  }
 
  // get the number of selected groups to see if other groups are selected
  const selectedKeys = Object.keys(selected);
 
  // this group is the only group selected, toggling the item selection
  if (selectedKeys.length < 2 && !filteredByKeys) {
    return handleSelect('toggle', selectObj);
  }
 
  // there are other items in other groups selected
  if (selectedKeys.length > 1 && !filteredByKeys) {
    return handleSelect('set', selectObj);
  }
 
  // this chart is not filtered by keys, and there are other groups selected
  // so we're going to set the selection to clear the other selected groups and items
  return handleSelect('set', selectObj);
  */
};

/**
 * TODO: Improve this documentation
 *
 * Bar chart UI takes a stand-alone styled Bar chart
 * and prepopulates certain settings and features based
 * filter and data providers.
 * then automatically converts the data for use with each custom chart
 * this saves times with chaching and adding certains settings
 * it also works with the useStyledCharts hook
 */
export const BarChartUi = ({
  widgetSettings,
  data,
  isLoading,
  hasError,
  hasMessage,
  title,
  handle,
  usesFilteredData,
  ...barChartProps
}: UseStyledChartProps): JSX.Element => {
  const { groupKey, type } = barChartProps;
  // checking for stacked bars or grouped bars
  const isGrouped = type !== 'bar';
  // lines up with bottom axis as well, typically date.  use a different chart if you're doing grouped % values
  const categoryKey = barChartProps.categoryKey || barChartProps.dateKey;

  if (!groupKey) return <>error loading chart, missing groupKey</>;
  if (!categoryKey) return <>error loading chart, missing categoryKey</>;
  if (!barChartProps.type) return <>error: missing chart type.</>;

  if (isGrouped && !categoryKey) return <>error loading chart, missing categoryKey or dateKey</>;

  const [selected, handleSelect] = useFilterSelected();

  const chartData = useMemo(() => {
    if (!data) return undefined;
    if (isGrouped) {
      return convertToStackedChartData(
        data as Record<string, unknown>[],
        groupKey,
        String(categoryKey)
      );
    } else return convertToChartData(data as Record<string, unknown>[], groupKey);
  }, [data]);

  widgetSettings = {
    title,
    ...widgetSettings,
    isLoading,
    hasError,
    hasMessage,
    className: `widget-ui--styled-chart widget-ui--bar-chart widget-ui--${type}` //'widget-ui--bar-chart-ui'
  };

  const handleClick = (datum: Record<string, unknown>) =>
    handleBarClick(datum, groupKey, categoryKey, handleSelect, { selected });

  const checkIfSelected = (datum: Record<string, unknown>): boolean =>
    usesFilteredData ? true : checkSelected(datum, groupKey, categoryKey, { selected });

  // update handlers
  handle = { ...handle, click: handleClick };

  // enable this once legend items for charts is done
  const showLegend = false; //legendSettings || hasLegend ? true : false

  // wrapper for the chart to save on rewriting code
  const ChartWrapper = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <WidgetUi
      {...widgetSettings}
      Main={
        // check if this chart has a legend
        showLegend ? (
          // render a Bar chart with legend
          <BarChartUiContainer>
            <div className={`${baseClass}__chart`}>{children}</div>
            <div className={`${baseClass}__legend`}>legend here</div>
          </BarChartUiContainer>
        ) : (
          // render just the Bar chart
          <div className={`widget-ui-main has-overflow ${baseClass} no-padding`}>{children}</div>
        )
      }
    />
  );

  // if we want a legend for this chart, render the wrapper
  return (
    <ChartWrapper>
      {!isGrouped ? (
        // this is not a stacked bar chart.  We have to infer the data type for a bar chart
        <StyledBarChart
          {...{
            handle,
            checkIfSelected,
            categoryKey,
            data: chartData as Record<string, unknown>[],
            ...barChartProps
          }}
        />
      ) : (
        // this is a stacked bar chart.  We have to infer the data type for a stacked bar chart
        <StyledBarChartGrouped
          {...{
            handle,
            checkIfSelected,
            categoryKey,
            data: chartData as Record<string, Record<string, unknown>[]>,
            ...barChartProps
          }}
        />
      )}
    </ChartWrapper>
  );
};
