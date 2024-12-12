import React from 'react';
import { ChartsWithDataFiltersPagePropsChart, StackedBarChart, useData } from '../../';
import { convertToStackedChartData } from 'components/StyledUi/js/chartDataHelpers';
import { WidgetUi } from 'components/StyledUi/WidgetUi';
import { DimensionsContainer } from 'components/StyledUi/DimensionsContainer';
import { useFilterSelected } from 'components/StyledUi/FilterSelected';
import { format } from 'date-fns';
import { TickProps } from 'victory-core';
import { StackedBarChartOverTimeTooltip } from './StackedBarChartTooltips';

export const StackedBarChartOverTime = ({
  groupKey,
  categoryKey,
  colors,
  title,
  colorKey
}: ChartsWithDataFiltersPagePropsChart): JSX.Element => {
  const { data, isLoading, hasError, hasMessage } = useData();

  const [selected, handleSelect] = useFilterSelected();

  if (!data || isLoading || hasError || hasMessage || !categoryKey)
    return (
      <WidgetUi
        {...{
          className: 'stacked-bar-chart',
          title,
          isLoading,
          hasError,
          hasMessage: !categoryKey ? `error building chart.  invalid or missing key` : hasMessage
        }}
      />
    );

  const stackedData = convertToStackedChartData(data, groupKey, categoryKey, {
    includeCategory: true,
    includeGroup: true,
    convertToDate: true
  });

  if (!stackedData) return <WidgetUi {...{ title, hasMessage: 'error loading chart data' }} />;

  const handleClick = (x?: Record<string, unknown>) => {
    return handleSelect('set', {
      [groupKey]: x?.group as string as string,
      [categoryKey as string]: x?.category as string as string
    });
  };

  const formatCategoryAxisLabels = (props: TickProps) => format(props as Date, 'M-d');

  const checkIfSelected = (x: Record<string, unknown>): boolean => {
    const { category, group } = x;
    if (!selected) {
      return true;
    } else {
      if (selected?.[categoryKey] && !selected?.[categoryKey]?.includes(category as string))
        return false;
      if (selected?.[groupKey] && selected?.[groupKey]?.includes(group as string)) return true;
    }
    return false;
  };

  const chartSettings = {
    colors,
    stackedData,
    handleClick,
    checkIfSelected,
    formatCategoryAxisLabels,
    colorKey: colorKey || `group`,
    CustomTooltip: StackedBarChartOverTimeTooltip
  };

  return (
    <WidgetUi
      className="no-padding"
      {...{ title, isLoading, hasMessage, hasError }}
      Main={
        <DimensionsContainer
          className="widget-ui-main no-padding has-overflow chart-container"
          Component={(dimensions) => <StackedBarChart {...{ dimensions, ...chartSettings }} />}
        />
      }
    />
  );
};
