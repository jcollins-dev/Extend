import React from 'react';

import { VictoryPie, VictoryPieProps, Slice, VictoryContainer } from 'victory';
import { ColorScalePropType } from 'victory-core';
import { StyledChartsProps } from './StyledCharts.types';
export type StyledChartsPropsDataItem = Record<string, unknown>;
export type StyledPieChartPropsData = StyledChartsPropsDataItem[];
export type StyledChartsPropsHandle = (datum?: Record<string, unknown>) => void;
export type StyledChartsPropsColors = Record<string, string>;

const styledChartSettings = ({
  width,
  height,
  handle,
  colors,
  colorScale
}: StyledChartsProps): VictoryPieProps => {
  width = width || 175;
  height = height || 175;

  const settings: VictoryPieProps = {
    width,
    height,

    // set padding to 0 so the chart takes up the whole container
    domainPadding: 0,
    padding: 0,

    // set the position of the tooltip
    labelRadius: Number(width) * 0.3,

    // adding the ariaLabel prop to the slice component to get the colors from
    dataComponent: (
      <Slice ariaLabel={({ datum }) => (datum.x ? `slice-${datum.x.replace(/ /g, '')}` : ``)} />
    ),

    events: [
      {
        target: 'data',
        eventHandlers: {
          onClick: () => ({
            // send slice data to click handler
            mutation: ({ datum }: { datum: Record<string, unknown> }) => {
              return handle?.click?.(datum);
            }
          })
        }
      }
    ]
  };

  if (!colors) settings.colorScale = colorScale || 'qualitative';

  return settings;
};

export interface StyledPieChartProps extends StyledChartsProps {
  data?: StyledPieChartPropsData;
}

export const StyledPieChart = ({
  data,
  width,
  height,
  handle,
  colorScale
}: StyledPieChartProps): JSX.Element => {
  if (!data) return <div>no data message</div>;

  const chartSettings = {
    ...styledChartSettings({ width, height, handle, colorScale }),

    // set the wrapper for the chart
    containerComponent: <VictoryContainer responsive={false} {...{ width, height }} />
  };

  return (
    <VictoryPie
      {...{
        data,
        ...chartSettings
      }}
    />
  );
};
