import React from 'react';
import { ChartsProps } from '../Charts.types';
import { VictoryBarProps } from 'victory';
import { VictoryStyleObject } from 'victory-core';
import { BarChartContainer } from './BarChart.elements';
import { DimensionsContainer, StyledUiContainerProps } from 'components';

export type BarChartPropsData = Record<string, unknown>[];

export interface BarChartProps extends ChartsProps {
  isDoughnut?: boolean;
  progress?: number;
  hideLabels?: boolean;
  InsideLabel?: JSX.Element;
}

interface Props extends BarChartProps, StyledUiContainerProps {
  data?: Record<string, unknown>[];
}

export const BarChart = ({ className, data, totalBy, groupKey, colors }: Props): JSX.Element => {
  className = className ? `bar-chart-container ${className}` : `bar-chart-container`;

  if (!data) return <>error: missing data</>;
  if (!groupKey) return <>error: missing groupKey</>;

  // setup slice styles (colors and selected states)
  const barStyles: VictoryStyleObject = {
    fill: (props) => {
      const datum = props.datum as Record<string, unknown>;
      const color = colors?.[datum.group as string];
      return color || ``;
    }
  };

  // setup default settings for pie chart
  const settings: VictoryBarProps = {
    data,
    x: groupKey,
    y: totalBy || 'count',
    padding: 5
  };

  // use victory colors if none provided
  if (!colors) settings.colorScale = 'qualitative';
  // use provided colors
  else
    settings.style = {
      data: barStyles
    };

  return (
    <BarChartContainer className={className}>
      <DimensionsContainer
        Component={({ width, height }) => {
          return (
            <div>
              bar chart {width} : {height}
            </div>
          );
        }}
      />
    </BarChartContainer>
  );
};
