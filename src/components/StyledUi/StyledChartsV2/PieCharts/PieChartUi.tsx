import React, { useMemo } from 'react';
import { StyledPieChart } from './StyledPieChart';
import { WidgetUi } from 'components/StyledUi/WidgetUi';
import { convertToChartData } from '../helpers';
import { PieChartUiContainer, baseClass } from './PieChartUi.elements';
import { UseStyledChartProps } from '../hooks';
import { filterSelectedData, useFilterSelected } from 'components/StyledUi/FilterSelected';
import { StyledChartLegend } from '../ChartLegends';

const checkSelected = (
  datum: Record<string, unknown>,
  groupKey: string,
  options?: {
    selected?: Record<string, string[]>;
    filteredByKeys?: string[];
  }
): boolean => {
  const { selected, filteredByKeys } = options || {};

  // there is nothing selected and there are no options
  if (!options) return true;

  // nothing is selected, so return true to show default view
  if (!selected) {
    return true;
  }

  // break down the variables for easier reading
  const checkVal = datum[groupKey] as string;

  // the values to check against
  const checkVals = selected?.[groupKey] as string[];

  // this chart is filtered by another chart
  if (!filteredByKeys) {
    // there are selected groups, but this group isn't one of them so show false
    if (!selected?.[groupKey]) {
      return false;
    }

    // check if this id is in the selected group array
    let isSelected = false;

    // loop through the selected group array to see if this id is in it
    checkVals.forEach((val: string) => (isSelected = val === checkVal ? true : isSelected));

    return isSelected;
  }

  const filteredByKey = filteredByKeys[0];

  // this charts parent filter is selected
  if (selected[filteredByKey]) {
    // this chart is filtered by another chart
    // but no items on this chart are selected
    if (!selected[groupKey]) return true;

    // default to false
    let isSelected = false;

    // break down variables for easier reading
    const checkVals = selected[groupKey] as string[];
    const checkVal = datum[groupKey] as string;

    // loop through the selected group array to see if this id is in it
    checkVals.forEach((val: string) => (isSelected = val === checkVal ? true : isSelected));

    return isSelected;
  }

  return true;
};

const handleSliceClick = (
  datum: Record<string, unknown>,
  groupKey: string,
  handleSelect: (x: string, sel?: Record<string, string | string[]>) => void,
  options?: {
    selected?: Record<string, string[]>;
    filteredByKeys?: string[];
    usesFilteredData?: boolean;
  }
): void => {
  const { selected, filteredByKeys } = options || {};

  // define new object to pass to handleSelect
  let selectObj: Record<string, string | string[]> = {
    // check for x, if x isn't there, check for groupKey (legend passed object k as groupKey)
    [groupKey]: (datum.x as string) || (datum[groupKey] as string),
    ...selected
  };

  // this chart is filtered by another chart so we need to make sure those keys remain selected
  if (filteredByKeys) {
    const parentGroupKey = filteredByKeys[0];
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
    return handleSelect('toggle', selectObj);
  }

  // this chart is not filtered by keys, and there are other groups selected
  // so we're going to set the selection to clear the other selected groups and items
  return handleSelect('toggle', selectObj);
};

const useChartData = (
  data: Record<string, unknown>[],
  groupKey: string,
  options?: {
    selected?: Record<string, string[]>;
    filteredByKeys?: string[];
  }
) => {
  const { selected, filteredByKeys } = options || {};

  const dataCache = useMemo(
    () =>
      convertToChartData(data as Record<string, unknown>[], groupKey, {
        calculatePercents: true
      }),
    [data]
  );

  const chartData: Record<string, unknown>[] | undefined = useMemo(() => {
    // make sure the data is here, check for filtered and if items are selected
    // this is done because we want to filter the data and re-calculate the percents
    // based on the parent group
    if (dataCache && filteredByKeys && selected) {
      const filteredData = filterSelectedData({
        data: dataCache,
        selected: filteredByKeys.reduce((acc, key) => {
          if (selected?.[key]) acc = { ...acc, [key]: selected[key] };
          return acc;
        }, {})
      });

      if (!filteredData) return undefined;

      return convertToChartData(filteredData, groupKey, { calculatePercents: true });
    }
    return dataCache;
  }, [dataCache, selected]);

  return chartData;
};

/**
 * TODO: Improve this documentation
 *
 * Pie chart UI takes a stand-alone styled pie chart
 * and prepopulates certain settings and features based
 * filter and data providers.
 * then automatically converts the data for use with each custom chart
 * this saves times with chaching and adding certains settings
 * it also works with the useStyledCharts hook
 */
export const PieChartUi = ({
  widgetSettings,
  colors,
  groupKey,
  hasLegend,
  hideLegend,
  data,
  isLoading,
  hasError,
  hasMessage,
  title,
  handle,
  legendSettings,
  filteredByKeys,
  usesFilteredData,
  ...pieChartProps
}: UseStyledChartProps): JSX.Element => {
  if (!groupKey) return <>error loading chart, missing groupKey</>;

  // overide filteredByKeys if usesFilteredData is true
  // this is because the data being sent is already filtered
  if (usesFilteredData) filteredByKeys = undefined;

  widgetSettings = {
    ...widgetSettings,
    isLoading,
    hasError,
    hasMessage,
    className: 'widget-ui--styled-chart widget-ui--pie-chart pie-chart-ui'
  };

  // adds the title to the widget settings if it exists
  if (title) widgetSettings = { ...widgetSettings, title };

  // add classname if this widget has a legend
  if (hasLegend || legendSettings)
    widgetSettings.className = `${widgetSettings.className} has-legend`;

  // return early if still loading or something is wrong with the data
  if (isLoading || hasError || hasMessage) {
    return <WidgetUi {...widgetSettings} />;
  }

  // get selected items from the FilterSelected provider/context
  const [selected, handleSelect] = useFilterSelected();

  // convert and filter the chart data
  const chartData = data && useChartData(data, groupKey, { selected, filteredByKeys });

  // return early if there is no data, something is wrong if this happens
  if (!chartData) {
    return <WidgetUi {...widgetSettings} hasMessage="no data" />;
  }
  // we get a return back, but there is nothing to show, that means there is nothing within with options given
  if (chartData?.length < 1) {
    return <WidgetUi {...widgetSettings} hasMessage="no data to display" />;
  }

  const handleClick = (datum: Record<string, unknown>) =>
    handleSliceClick(datum, groupKey, handleSelect, { selected, filteredByKeys });

  const handleLegendClick = ({ id }: { id: string }) => handleClick({ [groupKey]: id });

  const checkIfSelected = (datum: Record<string, unknown>) =>
    usesFilteredData ? true : checkSelected(datum, groupKey, { selected, filteredByKeys });

  handle = {
    ...handle,
    click: handleClick
  };

  const chartProps = {
    checkIfSelected,
    handle,
    data: chartData,
    colors,
    ...pieChartProps
  };

  const legendProps = (legendSettings || hasLegend) && {
    ...legendSettings,
    colors,
    handle: handleLegendClick,
    selected: selected?.[groupKey]
  };

  if (legendProps && !legendSettings)
    legendProps.items = chartData?.map((props: Record<string, unknown>) => {
      return {
        id: props[groupKey] as string,
        label: props[groupKey] as string
      };
    });

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        // check if this chart has a legend
        legendProps && !hideLegend ? (
          // render a pie chart with legend
          <PieChartUiContainer>
            <div className={`${baseClass}__chart`}>
              <StyledPieChart {...chartProps} />
            </div>
            <div className={`${baseClass}__legend`}>
              <StyledChartLegend {...legendProps} />
            </div>
          </PieChartUiContainer>
        ) : (
          // render just the pie chart
          <div className={`widget-ui-main ${baseClass} has-overflow is-centered no-padding`}>
            <StyledPieChart {...chartProps} />
          </div>
        )
      }
    />
  );
};
