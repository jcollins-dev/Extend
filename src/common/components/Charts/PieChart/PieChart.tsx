import React from 'react';
import { ChartsProps } from '../Charts.types';
import { VictoryPie, VictoryPieProps, VictoryTooltip } from 'victory';
import { VictoryStyleObject } from 'victory-core';
import { PieChartContainer } from './PieChart.elements';
import { ProgressPieChart } from './ProgressPieChart';
import { DimensionsContainer, StyledUiContainerProps } from 'components';
import { styledTheme } from 'components';

export type PieChartPropsData = Record<string, unknown>[];

export interface PieChartProps extends ChartsProps {
  isDoughnut?: boolean;
  progress?: number;
  hideLabels?: boolean;
  InsideLabel?: JSX.Element;
}

interface Props extends PieChartProps, StyledUiContainerProps {
  data?: Record<string, unknown>[];
}

export const PieChart = ({
  type,
  className,
  progress,
  data,
  totalBy,
  groupKey,
  isDoughnut,
  format,
  colors,
  color,
  hideLabels,
  InsideLabel
}: Props): JSX.Element => {
  className = className ? `pie-chart-container ${className}` : `pie-chart-container`;

  let startRadius = 0;
  let startInnerRadius = 0;

  // adjust for doughtnut chart
  if (type === 'doughnut') isDoughnut = true;

  if (progress) return <ProgressPieChart {...{ progress, InsideLabel, color }} />;

  if (!data) return <>error: missing data</>;
  if (!groupKey) return <>error: missing groupKey</>;

  // setup slice styles (colors and selected states)
  const sliceStyles: VictoryStyleObject = {
    fill: (props) => {
      const datum = props.datum as Record<string, unknown>;
      const color = colors?.[datum.group as string];
      return color || ``;
    }
  };

  // setup default settings for pie chart
  const settings: VictoryPieProps = {
    data,
    x: groupKey,
    y: totalBy || 'count',
    padding: 5
    // turning these off for now, having problems with hover events and Victory Tooltips not showing please keep
    /*
    events: [
      {
        target: 'data',
        eventHandlers: {
          onMouseLeave: () => ({
            target: 'data',
            mutation: (props) => ({
              // this makes the slice a little bigger on mouse over
              ...props,
              radius: startRadius,
              innerRadius: !isDoughnut ? 0 : startInnerRadius,
            })
          }),
          onMouseEnter: () => ({
            target: 'data',
            mutation: (props) => ({
              // this returns the slice to normal size
              ...props,
              radius: startRadius + 6,
              innerRadius: !isDoughnut ? 0 : startInnerRadius - 2,
            })
          })
        }
      }
    ]
    */
  };

  if (isDoughnut) {
    hideLabels = true;
  } else {
    hideLabels = false;
    InsideLabel = undefined;
  }

  // use victory colors if none provided
  if (!colors) settings.colorScale = 'qualitative';
  // use provided colors
  else
    settings.style = {
      data: sliceStyles
    };

  if (hideLabels) {
    settings.labelComponent = undefined;
    settings.labels = () => null;
  }

  // generate the base chart to return,
  // this will either contain labels or tootltips
  // of the chart has both labels and tooltips,
  // this main chart will contain the labels
  // and the tooltip chart will render on top of this one
  // with transparent slices that contain the tooltips

  // this chart does not have both tooltips and labels
  if (!InsideLabel) {
    return (
      <DimensionsContainer
        className={className}
        //centered
        Component={({ width, height }) => {
          settings.radius = width / 2;
          settings.labelRadius = settings.radius;
          if (isDoughnut) settings.innerRadius = settings.radius - 20;
          return <VictoryPie {...{ width, height, ...settings }} />;
        }}
        isDoughnut={isDoughnut}
      />
    );
  }

  // setup settings for hover layer pie chart
  const hoverSettings: VictoryPieProps = {
    // pass on all the settings from the main chart then override
    ...settings,
    style: !format?.label
      ? settings.style
      : {
          data: {
            // we set these slices to transparent because we want the user
            // to see the color and label of the slice under this chart
            fill: 'transparent'
          }
        },
    labelComponent: (
      <VictoryTooltip
        {...{
          flyoutPadding: {
            top: 5,
            bottom: 5,
            right: 10,
            left: 10
          },
          flyoutStyle: {
            fill: styledTheme.color.main,
            stroke: styledTheme.color.main
          },
          style: [
            {
              fill: 'white',
              fontFamily: 'inherit'
            },
            { fontSize: 6 },
            {
              fill: 'white',
              fontFamily: 'inherit',
              fontSize: 15
            }
          ],
          renderInPortal: true,
          orientation: 'top'
        }}
      />
    ),
    labels: format?.tooltip
  };

  const shadowChartSettings: VictoryPieProps = {
    ...settings,
    style: {
      data: {
        filter: 'drop-shadow(0px 3px 2px rgb(0 0 0 / 0.4))'
      }
    }
  };

  // this chart has both tooltips and labels so we need to render
  // 2 charts stacked on top of eachother

  return (
    <PieChartContainer className={className}>
      <DimensionsContainer
        Component={({ width, height }) => {
          // set the radius of chart based on container width
          settings.radius = width / 2 - 5;
          // save the starting radius for hover event
          if (startRadius === 0) startRadius = settings.radius;

          hoverSettings.radius = settings.radius;
          hoverSettings.labelRadius = hoverSettings.radius / 2;
          shadowChartSettings.radius = settings.radius;

          if (isDoughnut) {
            settings.innerRadius = settings.radius - 20;
            // save the starting radius for hover event
            if (startInnerRadius === 0) startInnerRadius = settings.innerRadius;

            hoverSettings.innerRadius = settings.innerRadius;
            shadowChartSettings.innerRadius = settings.innerRadius;
            hoverSettings.labelRadius = hoverSettings.radius - 10;
          }

          return (
            <>
              {
                // show the base chart based on what types of labels or tooltips are provided.
                // if there is a label and tooltip, we need to render one chart for labels and one for
                // tooltips
                !format?.tooltip && (
                  <div className="pie-chart-container__chart pie-chart-container__main-chart">
                    <VictoryPie {...{ width, height, ...settings }} />
                  </div>
                )
              }

              {
                // add the inside label if provided, this will have be below the chart and is only meant for doughtnut charts
                InsideLabel && isDoughnut && (
                  <div className="pie-chart-container__chart pie-chart-container__inside-label">
                    {InsideLabel}
                  </div>
                )
              }
              {
                // if this chart has a tooltip, render the hover chart which will sit on top of all the charts
                format?.tooltip && (
                  <div className="pie-chart-container__chart pie-chart-container__hover-chart">
                    <VictoryPie {...{ width, height, ...hoverSettings }} />
                  </div>
                )
              }
              {
                // have to render an additional chart for the drop shadow, otherwise each slice gets a shadow
                // and it doesn't look right.  this chart is always on the very bottom and is only for doughnut charts
                isDoughnut && (
                  <div className="pie-chart-container__drop-shadow">
                    <VictoryPie {...{ width, height, ...shadowChartSettings }} />
                  </div>
                )
              }
            </>
          );
        }}
        isDoughnut={isDoughnut}
      />
    </PieChartContainer>
  );
};
