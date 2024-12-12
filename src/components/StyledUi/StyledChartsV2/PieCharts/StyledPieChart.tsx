import React from 'react';
import { Slice, VictoryPie, VictoryTooltip, VictoryLabel, VictoryPieProps } from 'victory';
import { VictoryStyleObject, CallbackArgs, VictoryLabelStyleObject } from 'victory-core';

import {
  StyledChartsProps,
  StyledChartsPropsChartKeys,
  StyledChartsPropsDataItem
} from '../StyledCharts.types';

import { defaultTooltipSettings } from './StyledCharts.settings';
import { defaultTooltipStyles } from 'components/StyledUi/StyledCharts/StyledCharts.styles';
import { StyledPieChartContainer } from './StyledPieChart.elements';

export interface StyledPieChartProps extends StyledChartsProps, StyledChartsPropsChartKeys {
  data?: StyledChartsPropsDataItem[];
  chartKeys?: StyledChartsPropsChartKeys[];
}

export const StyledPieChart = ({
  data,
  groupKey,
  categoryKey,
  tooltipStyles,
  format,
  handle,
  colors,
  checkIfSelected
}: StyledPieChartProps): JSX.Element => {
  if (!data) return <>error: chart is missing data</>;

  const total = data.reduce((acc, obj) => (acc = acc + Number(obj.count)), 0);

  // we have to do all this outside of victory to bypass TS errors
  let sliceStyles: VictoryStyleObject = {
    // check if selected to change opacity
    fillOpacity: (props) =>
      !checkIfSelected ? 1 : checkIfSelected(props.datum as Record<string, unknown>) ? 1 : 0.2,
    cursor: 'pointer',
    transition: 'all 200ms liner'
  };

  // we have to do all this outside of victory to bypass TS errors
  // Only assign colors if we have them
  if (colors)
    sliceStyles = {
      ...sliceStyles,
      fill: !colors
        ? undefined
        : ({ datum }) => {
            const id = datum[groupKey || 'xName'];
            const color = colors?.[id];
            if (color) return color as string;
            else return `red`;
          }
    };

  const thelabelStyles: VictoryLabelStyleObject = {
    // check if selected to change opacity
    fillOpacity: (props) => {
      const datum = props?.datum as Record<string, unknown>;
      // don't show labels less than 10%, this crowds up the charts too much
      if (Number(datum.y) < 10) return 0;
      return !checkIfSelected ? 1 : checkIfSelected(datum) ? 1 : 0.7;
    },
    fontWeight: 500,
    fill: 'white',
    fontFamily: 'inherit',
    fontSize: 13
  };

  const thelabelBgStyles = {
    // check if selected to change opacity
    fillOpacity: (props: unknown) => {
      // have to do this for TS, thanks
      const theProps = props as Record<string, unknown>;
      // have to do this for TS, thanks
      const datum = theProps.datum as Record<string, unknown>;

      // don't show labels less than 10%, this crowds up the charts too much
      if (Number(datum.y) < 10) return 0;

      return !checkIfSelected ? 0.7 : checkIfSelected(datum) ? 0.7 : 0.4;
    },
    fill: 'black',
    rx: 5,
    ry: 5,
    filter: `drop-shadow(rgba(0, 0, 0, 0.3) 0px 3px 2px)`
  };

  const defaultWidth = 200;
  const defaultHeight = defaultWidth;

  // here we're figuring out if this chart has tooltip, labels or both
  // if it has tooltips, we only render one chart with tooltips for labels
  // if it has labels, we only render one chart with labels for labels
  // if the chart has both, we have to load the labels on the first chart,
  // then we have to render andother chart on top of the first one with tooltips,
  // but the top chart will have transparent slices so you can see the chart below with the tables.

  let Label = format?.label ? (
    <VictoryLabel
      style={thelabelStyles}
      backgroundPadding={[5, 2]}
      backgroundStyle={thelabelBgStyles}
    />
  ) : undefined;

  if (!format?.label && format?.tooltip)
    Label = (
      <VictoryTooltip style={tooltipStyles || defaultTooltipStyles} {...defaultTooltipSettings} />
    );

  // setting the default pie chart settings to pass down to the chart(s).
  // doing it this way because we have to stack charts if there are tooltips AND labels.
  const pieSettings: VictoryPieProps = {
    padding: 10,
    width: defaultWidth,
    height: defaultHeight,
    data: data,
    colorScale: colors ? undefined : 'qualitative',
    style: {
      data: sliceStyles
    },
    labelRadius: defaultWidth / 4,
    events: [
      {
        target: 'data',
        eventHandlers: {
          onClick: () => ({
            // send slice data to click handler
            mutation: ({ datum }: { datum: Record<string, unknown> }) => {
              return handle?.click?.(datum);
            }
          }),
          onMouseEnter: () => {
            return {
              target: 'data',
              mutation: ({
                // commenting this out because i will be needing to use it later
                // when i turn on hover styles and usage for html tooltips
                //
                // style, <--- used in commented out code below
                ...rest
              }) => {
                return handle?.mouseEnter?.(rest);
                /* saving this for later use
                // adding styles on mouse over via victory
                return {
                  style: { ...style, filter: 'drop-shadow(1px 1px 1px rgb(0 0 0 / 0.2))', fillOpacity: 1 },
                  // this makes the slice a little bigger on mouse over
                  radius: defaultWidth / 3.9,
                }
                */
              }
            };
          },
          onMouseLeave: () => ({
            // clear the tooltip on leave
            mutation: (props: Record<string, unknown>) => {
              return handle?.mouseLeave?.(props);
            }
          })
        }
      }
    ],

    labels:
      !format || (!format?.label && !format?.tooltip)
        ? undefined
        : (d) => {
            if (format.label) return format.label({ ...d, groupKey, categoryKey, total });
            if (format.tooltip) return format.tooltip({ ...d, groupKey, categoryKey, total });
            return '';
          },

    // we need to set the aria-label on the slice in a way that the slice color
    // can be extracted from the slice via JS, to pass to other components.
    // to do this we're going to use ariaLabel attribute on the path element in the html.
    // this is the only setting we can give the slice, victory limits the attributes you can assign.
    // we get the groupKey from the prop passed to chart or from the datum in the data.
    // then it assigns the "id" of this slice to the aria-label attribute.
    dataComponent: (
      <Slice
        ariaLabel={({ datum }: CallbackArgs) =>
          `color__${datum?.[groupKey || datum.groupKey].replace(/\s+/g, '-') || ``}`
        }
      />
    ),

    labelComponent: Label
  };

  if ((!format?.tooltip && format?.label) || (format?.tooltip && !format?.label))
    return <VictoryPie {...pieSettings} />;

  const hoverPieSettings = {
    // bring in the default settings
    ...pieSettings,
    // start overriding the default settings
    style: {
      data: { ...sliceStyles, fillOpacity: 0 }
    },
    labelComponent: (
      <VictoryTooltip style={tooltipStyles || defaultTooltipStyles} {...defaultTooltipSettings} />
    ),
    dataComponent: undefined,
    labels: (d: Record<string, unknown>) => {
      const label = format?.tooltip?.({ ...d, groupKey, categoryKey, total }) || '';
      return label;
    }
  };

  return (
    <StyledPieChartContainer className="hover-container">
      <VictoryPie {...pieSettings} />
      <div className="hover-layer">
        <VictoryPie {...hoverPieSettings} />
      </div>
    </StyledPieChartContainer>
  );
};
