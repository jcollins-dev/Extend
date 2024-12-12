import React from 'react';
import { ChartsProps } from '../Charts.types';
import { VictoryPie, VictoryPieProps } from 'victory';
import { VictoryStyleObject } from 'victory-core';
import { PieChartContainer } from './PieChart.elements';
import { DimensionsContainer } from 'components';

export interface ProgressPieChartProps extends ChartsProps {
  isDoughnut?: boolean;
  progress?: number;
  color?: string;
  hideLabels?: boolean;
  InsideLabel?: JSX.Element;
}

interface Props extends ProgressPieChartProps {
  data?: Record<string, unknown>[];
}

export const ProgressPieChart = ({
  progress,
  isDoughnut,
  color,
  InsideLabel
}: Props): JSX.Element => {
  if (!progress) return <>error: missing data</>;

  isDoughnut = true;

  // Calculate the remaining progress
  const remainingProgress = 100 - progress;

  // Define data for the pie chart
  const data = [
    { x: 'progress', y: progress },
    { x: 'remaining', y: remainingProgress }
  ];

  // setup slice styles (colors and selected states)
  const sliceStyles: VictoryStyleObject = {
    fill: (props) => {
      const datum = props.datum as Record<string, unknown>;
      if (datum.x === 'progress') return color || ``;
      else return 'rgba(0,0,0,.2)';
    }
  };

  // setup default settings for pie chart
  const settings: VictoryPieProps = {
    data,
    labels: () => ''
  };

  // hide inside label if this is a doughnut chart
  if (!isDoughnut) InsideLabel = undefined;

  // use victory colors if none provided
  if (!color) settings.colorScale = 'qualitative';
  // use provided colors
  else
    settings.style = {
      data: sliceStyles
    };

  const shadowChartSettings: VictoryPieProps = {
    ...settings,
    style: {
      data: {
        filter: 'drop-shadow(0px 3px 2px rgb(0 0 0 / 0.4))',
        fill: 'rgba(229, 233, 237, 1)'
      }
    }
  };

  return (
    <PieChartContainer className="pie-chart-container">
      <DimensionsContainer
        Component={({ width }) => {
          settings.radius = width / 2;
          shadowChartSettings.radius = settings.radius;
          if (isDoughnut) {
            settings.innerRadius = settings.radius - 20;
            shadowChartSettings.innerRadius = settings.innerRadius;
          }
          return (
            <>
              <div className="pie-chart-container__main-chart">
                <VictoryPie {...{ width, height: width, ...settings }} />
              </div>
              {InsideLabel && (
                <div className="pie-chart-container__inside-label">{InsideLabel}</div>
              )}
              {isDoughnut && (
                <div className="pie-chart-container__drop-shadow">
                  <VictoryPie {...{ width, height: width, ...shadowChartSettings }} />
                </div>
              )}
            </>
          );
        }}
      />
    </PieChartContainer>
  );
};
