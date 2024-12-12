import React from 'react';
import { ChartsWithDataFiltersPagePropsChart, useSettings } from '../../';
import { StackedBarChartOverTime } from './StackedBarChartOverTime';
import { PieChartWithLegend } from './PieChartWithLegend';

/*  PLEASE KEEP THIS
const ChartsWithFiltersPagePieChart = ({
  groupKey,
  colors,
  title,
  colorKey
}: ChartsWithDataFiltersPagePropsChart): JSX.Element => {
  const { data, isLoading, hasError, hasMessage } = useData();

  //if (!data || !categoryKey || !groupKey || isLoading || hasError || hasMessage) return <WidgetUi {...{ title, isLoading, hasMessage, hasError }} />

  const chartData =
    data &&
    convertToChartData(data, groupKey, {
      addLabelKey: true,
      calculatePercents: true
    });

  if (!chartData) return <>error no chart data</>;

  const [selected, handleSelect] = useFilterSelected();

  const selectedGroups = selected?.[groupKey];

  const handleClick = (x?: Record<string, unknown>) => {
    return handleSelect('toggle', {
      [groupKey as string]: x?.label as string
    });
  };

  const checkIfSelected = (x: Record<string, unknown>): boolean => {
    const { label } = x;
    const isSelected = !selectedGroups ? true : selectedGroups.includes(label as string);
    return isSelected;
  };

  return (
    <WidgetUi
      {...{ title, isLoading, hasMessage, hasError }}
      Main={
        <DimensionsContainer
          className="widget-ui-main"
          Component={(dimensions) => (
            <PieChart
              {...{
                dimensions,
                handleClick,
                checkIfSelected,
                data: chartData,
                colors,
                colorKey: 'label',
                className: 'widget-ui-main'
              }}
            />
          )}
        />
      }
    />
  );
};
*/

const ChartWidget = ({ chartType, ...rest }: ChartsWithDataFiltersPagePropsChart): JSX.Element => {
  switch (chartType) {
    case `pie`:
      return <div>pie</div>;

    case `pie-with-legend`:
    case `alarms-pie`:
      return <PieChartWithLegend {...rest} />;

    case `stacked-bar`: {
      return <StackedBarChartOverTime {...rest} />;
    }

    default:
      return <></>;
  }
};

export const ChartsArea = (): JSX.Element => {
  const { charts } = useSettings();
  if (!charts) return <></>;
  return (
    <>
      {charts.map(({ ChartComponent, ...chart }, i) => {
        if (ChartComponent) return ChartComponent;
        else return <ChartWidget {...chart} key={`chart${i}`} />;
      })}
    </>
  );
};
