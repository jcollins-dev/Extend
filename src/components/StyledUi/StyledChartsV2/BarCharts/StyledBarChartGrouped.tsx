import React from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack, VictoryTooltip } from 'victory';
import { VictoryStyleObject } from 'victory-core';
import { StyledChartsProps, StyledChartsPropsChartKeys } from '../StyledCharts.types';
import {
  defaultTickLabelsStyles,
  defaultAxisStyles
  //defaultAxisYGridStyles
} from '../StyledCharts.styles';
import { defaultChartSettings, defaultTooltipSettings } from './StyledCharts.settings';
import { defaultLabelStyles } from 'components/StyledUi/StyledCharts/StyledCharts.styles';
import { generateDateRangeCategories } from '../helpers';
import { useDateRange, DimensionsContainer, UseContainerSizeReturnProps } from 'components';
import { overTime } from '../StyledChartsTooltips';

export interface StyledBarChartGroupedProps extends StyledChartsProps, StyledChartsPropsChartKeys {
  data?: Record<string, Record<string, unknown>[]>;
}

/*---------------------
 USE THIS CHART IF YOU ARE GROUPING DATA TO DISPLAY EITHER STACKED, SIDE-BY-SIDE, OR LAYERED ON TOP OF EACHOTHER 
 -----------------------
 EXAMPLE: Alams chart that groups the alarms by type and display them over time 
----------------------*/
export const StyledBarChartGrouped = ({
  type,
  data,
  groupKey,
  categoryKey,
  dateKey,
  colors,
  fill,
  axisView,
  //gridLinesView,
  hideTooltips,
  tooltipStyles,
  format,
  handle,
  checkIfSelected,
  useDataReturnDateRange
}: StyledBarChartGroupedProps): JSX.Element => {
  const { startTime, endTime } = useDateRange().utcTZConvertedISO;

  if (!data) return <>error: chart is missing data</>;
  if (!groupKey || !categoryKey) return <>error: chart missing groupKey or categoryKey</>;
  if (Object.keys(data).length === 0) return <div className="is-centered">no data to display</div>;

  // check if we want to show or hid the axis.  Default is to show
  const hasAxis = axisView !== 'hide' ? true : false;

  let dateRangeCategories: string[] | undefined = undefined;

  switch (type) {
    case 'bar-over-time':
    case 'stacked-bar-over-time': {
      dateRangeCategories = generateDateRangeCategories(
        data,
        useDataReturnDateRange ? undefined : [startTime, endTime]
      );
      format = {
        ...format,
        tooltip: (props) => overTime.format({ ...props, dateKey, groupKey }),
        axisX: (label: string): string => {
          return Number.isInteger(parseFloat(label)) ? `${label}` : '';
        },
        axisY: (label: string): string => {
          label = String(label).slice(5);
          const [m, d] = label.split('-');
          return `${Number(m)}/${d}`;
        }
      };
      tooltipStyles = overTime.styles;
    }
  }

  // check if we want to show the grid lines, default is to show
  // if axis is turned off, we wont have grid lines
  // const hasGridLines = gridLinesView !== 'hide' ? true : false;

  const formatTooltip = (d: Record<string, unknown>) => {
    if (!d) return '';
    else if (format?.tooltip) return format?.tooltip({ categoryKey, groupKey, dateKey, ...d });
    else return '';
  };

  const axisStyles = {
    tickLabels: defaultTickLabelsStyles,
    axis: defaultAxisStyles
  };

  let barStyles: VictoryStyleObject = {
    fillOpacity: (props) =>
      !checkIfSelected ? 1 : checkIfSelected(props.datum as Record<string, unknown>) ? 1 : 0.2,
    cursor: 'pointer',
    transition: 'fill-opacity 200ms ease'
  };

  if (colors)
    barStyles = {
      ...barStyles,
      fill: !colors
        ? undefined
        : ({ datum }) => {
            const id = datum[groupKey || 'xName'];
            const color = colors?.[id];
            if (color) return color as string;
            else return `red`;
          }
    };

  const categoryCount = dateRangeCategories?.length || 0;

  const AxisX = hasAxis && (
    <VictoryAxis dependentAxis style={axisStyles} tickFormat={format?.axisX} />
  );

  const AxisY = hasAxis && (
    <VictoryAxis
      width={20}
      // this setting prevents labels from overlapping.
      // this may raise questions on why some dates don't show up on the bottom axis
      // but it's not a bug, it's a feature
      fixLabelOverlap
      // set these if you want to specify the ticks on the bottom axis
      // keeping for later use
      // tickValues={dateRangeCategories}
      // tickCount={13}

      style={axisStyles}
      tickFormat={format?.axisY}
    />
  );

  return (
    <DimensionsContainer
      className={`styled-${type}`}
      dims={{ height: 200 }}
      Component={({ width, height }: UseContainerSizeReturnProps) => {
        // we need to return nothing if the div hasn't been loaded to the dom yet
        if (width === 0 || height === 0) return <></>;
        // get how many pixels wide each column should be based on the amount of bottom axis category tick marks
        //  n const colWidth = Math.floor(width / (categoryCount - 4));

        return (
          <VictoryChart
            width={width}
            height={height}
            //domainPadding={{ x: colWidth, y: 10 }}
            {...defaultChartSettings}
          >
            {
              // we put these on top because VictoryChart loops through children as an array
              // and renders them in reverse order, putting the grid lines of top of the bars
              AxisX
            }

            {
              // we put these on top because VictoryChart loops through children as an array
              // and renders them in reverse order, putting the grid lines of top of the bars
              AxisY
            }

            <VictoryStack categories={dateRangeCategories ? { x: dateRangeCategories } : undefined}>
              {
                // loop through object, getting the keys as the groupId base on groupKey value, then value is the array
                // of bar data to be rendered for that group or "stack"
                Object.entries(data).map(([group, barData]) => {
                  return (
                    <VictoryBar
                      barWidth={categoryCount < 4 ? width * (categoryCount / 102) : 10}
                      //barRatio={categoryCount > 4 ? 0.25 : undefined}
                      key={group}
                      data={barData}
                      colorScale={fill ? undefined : 'qualitative'}
                      style={{
                        data: barStyles
                      }}
                      events={[
                        {
                          target: 'data',
                          eventHandlers: {
                            onClick: () => ({
                              // send slice data to click handler
                              mutation: ({ datum }: { datum: Record<string, unknown> }) => {
                                return handle?.click?.(datum);
                              }
                            }),
                            onMouseEnter: () => ({
                              // send slice data to hover handler for tooltips
                              mutation: (props: Record<string, unknown>) => {
                                return handle?.mouseEnter?.(props);
                              }
                            }),
                            onMouseLeave: () => ({
                              // clear the tooltip on leave
                              mutation: (props: Record<string, unknown>) => {
                                return handle?.mouseLeave?.(props);
                              }
                            })
                          }
                        }
                      ]}
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
                  );
                })
              }
            </VictoryStack>
          </VictoryChart>
        );
      }}
    />
  );
};
