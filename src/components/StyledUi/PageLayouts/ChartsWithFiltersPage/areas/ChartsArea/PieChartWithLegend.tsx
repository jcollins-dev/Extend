import React from 'react';

import { WidgetUi } from 'components/StyledUi/WidgetUi';
import { ChartsWithDataFiltersPagePropsChart } from '../../';
import { useData } from '../../';
import { useFilterSelected } from 'components/StyledUi/FilterSelected';
import { convertToChartData } from 'components/StyledUi/js/chartDataHelpers';
import { PieChartWithLegend as ChartWithLegend } from '../../components';
import { PieChartLegendPropsHandlerReturn } from '../../components/Charts/PieChartWithLegend';
import { PieChartWithLegendContainer } from './PieChartWithLegend.elements';
import { styledTheme } from 'components/StyledUi/theme';

const alarmsLegendItems = [
  { label: `A-Alarm (Critical)`, id: `Critical`, color: styledTheme.charts.alarms.Critical },
  {
    label: `B-Alarm (Product)`,
    id: `Product Alarm`,
    color: styledTheme.charts.alarms['Product Alarm']
  },
  { label: `C-Alarm (Warning)`, id: `Warning`, color: styledTheme.charts.alarms.Warning }
];

export const PieChartWithLegend = ({
  groupKey,
  colors,
  title,
  colorKey
}: ChartsWithDataFiltersPagePropsChart): JSX.Element => {
  const { data, isLoading, hasError, hasMessage } = useData();

  const [selected, handleSelect] = useFilterSelected();

  if (!data || isLoading || hasError || hasMessage)
    return <WidgetUi {...{ title, isLoading, hasError, hasMessage }} />;

  const chartData = convertToChartData(data, groupKey, {
    addLabelKey: true,
    calculatePercents: true
  });

  if (!chartData) return <WidgetUi {...{ title, hasMessage: 'error loading chart data' }} />;

  const selectedGroups = selected?.[groupKey];

  const checkIfSelected = (x: Record<string, unknown>): boolean =>
    selected?.searchTerm
      ? false
      : !selectedGroups
      ? true
      : selectedGroups.includes(x?.label as string);

  const handleClick = (x: string) => {
    return handleSelect(selected?.searchTerm ? 'set' : 'toggle', {
      [groupKey as string]: x
    });
  };

  const chartSettings = {
    checkIfSelected,
    selected,
    colors,
    data: chartData,
    colorKey,
    handleClick: (props?: Record<string, unknown>) => props && handleClick(props.x as string)
  };

  const legendSettings = {
    colors,
    items: alarmsLegendItems,
    handle: (props: PieChartLegendPropsHandlerReturn) => handleClick(props.id as string),
    selected: selectedGroups,
    colorKey
  };

  const widgetSettings = {
    title,
    className: 'pie-chart-with-legend'
  };

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <PieChartWithLegendContainer>
          <ChartWithLegend {...{ chartSettings, legendSettings }} />
        </PieChartWithLegendContainer>
      }
    />
  );
};

/*

<PieChart
        {...{
          data,
          dimensions,
          colors,
          handleClick,
          checkIfSelected,
          colorScale,
          colorKey,
          CustomTooltip,
          labelRadius: dimensions.width / 2,
          formatLabels: (datum) => {
            const y = datum.y as number;
            return `${y}%`;
            //return Number(y as number) > 15 ? `${y}%` : ``;
          }
        }}
      />

      */
