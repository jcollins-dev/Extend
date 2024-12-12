import React from 'react';
import {
  VictoryAxis,
  VictoryLine,
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import {
  StyledChartsProps,
  StyledChartsPropsChartKeys,
  StyledChartsPropsDataItem
} from '../StyledCharts.types';

import {
  defaultTickLabelsStyles,
  defaultAxisStyles,
  defaultAxisXGridStyles,
  defaultAxisYGridStyles
} from '../StyledCharts.styles';
import { defaultChartSettings, defaultTooltipSettings } from './StyledCharts.settings';
import { defaultLabelStyles } from 'components/StyledUi/StyledCharts/StyledCharts.styles';

export interface StyledLineChartProps extends StyledChartsProps {
  data?: StyledChartsPropsDataItem[];
}

export const StyledLineChart = ({
  chartKeys,
  data,
  xKey,
  yKey,
  groupKey,
  categoryKey,
  stroke,
  fill,
  styles,
  axisView,
  hideTooltips,
  tooltipStyles,
  format,
  interpolation,
  dateKey,
  valueKey
}: StyledLineChartProps): JSX.Element => {
  if (!data) return <>error: chart is missing data</>;

  xKey = xKey || categoryKey || dateKey;
  yKey = yKey || valueKey;

  // check if we want to show or hid the axis.  Default is to show
  const hasAxis = axisView === 'hide' ? false : true;

  const lineStyles = {
    strokeWidth: 0.5,
    stroke: stroke || styles?.data?.fill || 'black',
    fill: fill || styles?.data?.fill
  };

  const formatTooltip = (d: Record<string, unknown>) => {
    if (format?.tooltip) return format?.tooltip(d);
    const datum = d?.datum as Record<string, unknown>;
    return `${datum[xKey || groupKey || 'xName']}: ${datum[yKey || categoryKey || '_y']}`;
  };

  if (!xKey && !yKey && !chartKeys) return <>error: chart is missing keys</>;

  // return early if no axis
  if (!hasAxis) {
    // return a single line chart without axis
    return (
      <VictoryLine
        data={data}
        x={xKey}
        y={yKey}
        style={{ data: { ...lineStyles, stroke } }}
        interpolation={interpolation || 'linear'}
        labels={
          hideTooltips
            ? undefined
            : (d) => formatTooltip({ ...d, xKey, yKey, groupKey, categoryKey })
        }
        labelComponent={
          hideTooltips ? undefined : (
            <VictoryTooltip
              style={hideTooltips ? undefined : tooltipStyles || defaultLabelStyles}
              {...defaultTooltipSettings}
            />
          )
        }
      />
    );
  }

  const axisStyles = {
    tickLabels: defaultTickLabelsStyles,
    axis: defaultAxisStyles
  };

  const formatAxisX = (d: string) => {
    if (format?.axisX) return format?.axisX(d);
    else return d;
  };

  const formatAxisY = (d: string) => {
    if (format?.axisY) return format?.axisY(d);
    else return d;
  };

  return (
    <VictoryChart
      width={650}
      height={300}
      containerComponent={<VictoryVoronoiContainer />}
      {...defaultChartSettings}
    >
      {
        // this chart has multiple lines, so we need to map over the chartKeys
        chartKeys &&
          chartKeys.map(({ xKey, yKey, dateKey, valueKey, categoryKey, stroke }, i) => (
            <VictoryLine
              key={`lineChart${i}`}
              data={data}
              x={xKey || categoryKey || dateKey}
              y={yKey || valueKey}
              style={{ data: { ...lineStyles, stroke } }}
              interpolation={interpolation || 'linear'}
              labels={
                hideTooltips
                  ? undefined
                  : (d) => formatTooltip({ ...d, xKey, yKey, groupKey, categoryKey })
              }
              labelComponent={
                hideTooltips ? undefined : (
                  <VictoryTooltip
                    style={hideTooltips ? undefined : tooltipStyles || defaultLabelStyles}
                    {...defaultTooltipSettings}
                  />
                )
              }
            />
          ))
      }

      {
        // this chart has one, so we only render based on the xKey and yKey or groupKey and categoryKey
        ((xKey && yKey) || (groupKey && categoryKey)) && (
          <VictoryLine
            data={data}
            x={xKey}
            y={yKey}
            style={{ data: { ...lineStyles, stroke } }}
            interpolation={interpolation || 'linear'}
            labels={hideTooltips ? undefined : formatTooltip}
            labelComponent={
              hideTooltips ? undefined : (
                <VictoryTooltip
                  style={hideTooltips ? undefined : tooltipStyles || defaultLabelStyles}
                  {...defaultTooltipSettings}
                />
              )
            }
          />
        )
      }

      <VictoryAxis
        dependentAxis
        style={{ grid: defaultAxisXGridStyles, ...axisStyles }}
        tickFormat={formatAxisX}
      />

      <VictoryAxis
        fixLabelOverlap
        tickCount={6}
        style={{ grid: defaultAxisYGridStyles, ...axisStyles }}
        tickFormat={formatAxisY}
      />
    </VictoryChart>
  );
};
