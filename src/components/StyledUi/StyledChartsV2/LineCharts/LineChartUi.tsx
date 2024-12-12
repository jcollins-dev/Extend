import React, { ReactNode, useMemo } from 'react';
import { StyledLineChart } from './StyledLineChart';
import { WidgetUi } from 'components/StyledUi/WidgetUi';
import { convertToChartData, convertToStackedChartData } from '../helpers';
import { LineChartUiContainer, baseClass } from './LineChartUi.elements';
import { UseStyledChartProps } from '../hooks';
import { useFilterSelected } from 'components/StyledUi/FilterSelected';
/**
 * TODO: Improve this documentation
 *
 * Line chart UI takes a stand-alone styled Line chart
 * and prepopulates certain settings and features based
 * filter and data providers.
 * then automatically converts the data for use with each custom chart
 * this saves times with chaching and adding certains settings
 * it also works with the useStyledCharts hook
 */
export const LineChartUi = ({
  widgetSettings,
  legendSettings,
  hasLegend,
  data,
  isLoading,
  hasError,
  hasMessage,
  title,
  handle,
  ...lineChartProps
}: UseStyledChartProps): JSX.Element => {
  const { groupKey, type } = lineChartProps;

  const categoryKey = lineChartProps.categoryKey || lineChartProps.dateKey;

  if (!groupKey || !categoryKey) return <>error loading chart, missing groupKey</>;

  const [selected, handleSelect] = useFilterSelected();

  widgetSettings = {
    title,
    isLoading,
    hasError,
    hasMessage,
    className: `widget-ui--styled-chart widget-ui--Line-chart widget-ui--${type}`,
    ...widgetSettings
  };

  const chartData = useMemo(
    () => convertToChartData(data as Record<string, unknown>[], groupKey),
    [data]
  );

  const handleClick = (datum: Record<string, unknown>) => {
    if (categoryKey)
      return handleSelect('set', {
        [groupKey]: datum[groupKey] as string,
        [categoryKey]: datum[categoryKey] as string
      });
    else
      return handleSelect('toggle', {
        [groupKey]: datum[groupKey] as string
      });
  };

  const checkIfSelected = (datum: Record<string, unknown>): boolean => {
    let isSelected = true;
    if (selected) {
      let selectCounter = 0;
      // loop through selected object and get all the keys and values of selected items
      Object.entries(selected).forEach(([selectedKey, selectedValues]) => {
        // check if this object has a key on the selected list
        if (datum?.[selectedKey] && selectedValues.includes(datum[selectedKey] as string)) {
          ++selectCounter;
        }
      });

      if (selectCounter < Object.keys(selected).length) isSelected = false;
    }
    return isSelected;
  };

  handle = { ...handle, click: handleClick };

  // enable this once legend items for charts is done
  const showLegend = false; //legendSettings || hasLegend ? true : false

  const ChartWrapper = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <WidgetUi
      {...widgetSettings}
      Main={
        // check if this chart has a legend
        showLegend ? (
          // render a Line chart with legend
          <LineChartUiContainer>
            <div className={`${baseClass}__chart`}>{children}</div>
            <div className={`${baseClass}__legend`}>legend here</div>
          </LineChartUiContainer>
        ) : (
          // render just the Line chart
          <div className={`widget-ui-main has-overflow ${baseClass} no-padding`}>{children}</div>
        )
      }
    />
  );

  // if we want a legend for this chart, render the wrapper
  return (
    <ChartWrapper>
      <StyledLineChart
        {...{ handle, checkIfSelected, categoryKey, ...lineChartProps }}
        data={chartData as Record<string, unknown>[]}
      />
    </ChartWrapper>
  );
};

/*

<StyledLineChart
        {...lineChartProps}
        {...{ handle, checkIfSelected, categoryKey }}
        data={chartData as Record<string, unknown>[]}
      />

*/
