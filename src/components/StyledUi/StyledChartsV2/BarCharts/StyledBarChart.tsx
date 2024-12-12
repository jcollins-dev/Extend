import React from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTooltip } from 'victory';

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

import { DimensionsContainer, UseContainerSizeReturnProps } from 'components';

export interface StyledBarChartProps extends StyledChartsProps, StyledChartsPropsChartKeys {
  data?: StyledChartsPropsDataItem[];
  chartKeys?: StyledChartsPropsChartKeys[];
}

export const StyledBarChart = ({
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
  format
}: StyledBarChartProps): JSX.Element => {
  if (!data) return <>error: chart is missing data</>;

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

  // return early if no axis
  if (!hasAxis) {
    // return a single line chart without axis
    return (
      <VictoryBar
        data={data}
        x={xKey || groupKey}
        y={yKey || categoryKey}
        style={{ data: { ...lineStyles, stroke } }}
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
    <DimensionsContainer
      className="styled-bar-chart"
      Component={({ width, height }: UseContainerSizeReturnProps) => {
        if (width === 0 || height === 0) return <></>;
        return (
          <VictoryChart width={width} height={height} {...defaultChartSettings}>
            {
              // this chart has multiple stacks, so we need to map over the chartKeys
              chartKeys &&
                chartKeys.map(({ xKey, yKey, groupKey, categoryKey, stroke }, i) => (
                  <VictoryBar
                    key={`lineChart${i}`}
                    data={data}
                    x={xKey || groupKey}
                    y={yKey || categoryKey}
                    style={{ data: { ...lineStyles, stroke } }}
                    labels={
                      hideTooltips
                        ? undefined
                        : (d) => formatTooltip({ ...d, xKey, yKey, groupKey, categoryKey })
                    }
                    labelComponent={
                      hideTooltips ? undefined : (
                        <VictoryTooltip
                          style={hideTooltips ? undefined : tooltipStyles || defaultLabelStyles}
                          dy={-3}
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
                <VictoryBar
                  data={data}
                  x={xKey || groupKey}
                  y={yKey || categoryKey}
                  style={{ data: { ...lineStyles, stroke } }}
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
      }}
    />
  );
};
