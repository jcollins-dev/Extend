// 3rd party libs
import React, { useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { VictoryAxis, VictoryChart, VictoryBar, VictoryTooltip } from 'victory';
import { cloneDeep } from 'lodash';

// Theme
import victoryTheme from 'themes/victory';

// Components
import { ScatterChart, styledTheme } from 'components';
import TickLabelYComponent from './TickLabelYComponent';
import TrackingLinesComponent from './TrackingLinesComponent';

// Hooks
import { useContainerSize } from 'hooks';

// Helpers
import { formatDate, getUserTimeZone, isUSTimeZone } from 'helpers';
import { DEFAULT_LEFT_PADDING } from 'helpers/graph';

// Types
import { ProteinMachineCategoryStates, ProteinMachineState } from 'types/protein';
import { DateTuple } from 'types';
import { BrushProps } from 'types/graph';

// Utils
import {
  DefaultTooltip,
  zoomIn,
  spanPeriodsRenderer,
  VictoryVoronoiBrushContainer,
  SyncVictoryAxis
} from './utils';

// Providers
import { useContainerResize, useDate, useTimeZone } from 'providers';

const DEFAULT_BAR_WIDTH = 33;
const BAR_SPACING = 5;
const INTERVAL_SPACING = 0;

export interface RowClickEvent {
  idx: number | undefined;
  parentRowProperty?: string;
}

// Row describes a horizontal row of bars in the chart, and the accompanying label
export interface Row {
  label: string;
  state: string | ProteinMachineState | ProteinMachineCategoryStates;
  isButton?: boolean;
  isLabel?: boolean;
  isExpanded?: boolean;
  bars: BarPeriod[];
  parentRowProperty?: string;
  key: string;
  stateNameLabel?: string;
}

// BarPeriod describes a single bar in a row
export interface BarPeriod {
  state: string | ProteinMachineState;
  startTime: Date;
  endTime: Date;
  color?: string;
  toolTipData?: Record<string, unknown>;
}

// SpanPeriod describes a rectangle that spans the entire height of the chart
export interface SpanPeriod {
  id: string;
  startTime: Date;
  endTime: Date;
  color: string;
  toolTipData?: Record<string, unknown>;
}

// TrackingLine points out the difference between two dates(actual & target) in the chart
export interface TrackingLine {
  id: string;
  targetTime: Date;
  actualTime: Date;
  color: string;
  dashed?: boolean;
}

export interface ScatterChartData {
  x: number | string | Date;
  y: number;
  label?: string;
}

export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

type Props = {
  rows: Row[];
  spanPeriods?: SpanPeriod[];
  trackingLines?: TrackingLine[];
  scatterChartData?: { title?: string; data: ScatterChartData[] };
  rowHeight?: number;
  barSpacing?: number;
  barCornerRadius?: number;
  intervalSpacing?: number;
  padding?: Padding;
  hasZoom?: boolean;
  zooming?: boolean;

  customTooltip?: JSX.Element;

  onLabelClick?: (e: RowClickEvent) => void;
  onBarClick?: (bar: BarPeriod) => void;
  tickLabelPadding?: string | number;
  brush?: BrushProps;
  syncAxis?: boolean;
  hideSubStepIds?: boolean;
};

interface GraphContainerProps {
  hasData?: boolean;
}

const GraphContainer = styled.div<GraphContainerProps>`
  flex: 1;
  justify-content: center;
  align-items: center;

  .no_data_graph {
    display: flex;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: ${styledTheme.color.headline.primary};
    text-align: center;
    justify-content: center;
    height: 100%;
    align-items: center;
  }
`;

/**
 * Renders a chart of colored bars representing various states on the y axis, plotted against time on the x-axis.
 * N.B. By "state" here we mean any given property, state, or other "thing", not just ProteinMachineStates.
 * We can plot any given property (e.g. string value, or ProteinMachineState).
 * E.g. we can also use this component to plot cleaning steps over time.
 * The label on the y axis can be rendered as an action button, which can be used to expand other rows etc.
 * The logic for this is not handled within this component - it simply renders the rows passed to it.
 *
 * Note - since we pass the horixontal={true} prop to VictoryChart, some x and y values become reversed,
 * which can be confusing.
 */
const StateOverTimeChart = ({
  rows,
  rowHeight = DEFAULT_BAR_WIDTH,
  hasZoom = false,
  zooming = false,
  padding,
  brush,
  onLabelClick,
  spanPeriods,
  scatterChartData,
  trackingLines,
  barSpacing,
  intervalSpacing,
  hideSubStepIds,
  tickLabelPadding,
  customTooltip,
  syncAxis
}: Props): JSX.Element => {
  // Get datePicker values
  const { startTime, endTime } = useDate();
  const { timeZone } = useTimeZone();
  const theme = useTheme();

  // Victory plots the rows bottom-to-top, so we reverse them first here
  const innerRows = [...rows].reverse();

  const graphPadding = {
    top: padding?.top ?? 50,
    right: padding?.right ?? 30,
    bottom: padding?.bottom ?? 0,
    left: syncAxis ? DEFAULT_LEFT_PADDING : padding?.left ?? 10
  };

  // Measure the graph container and pass the size into victory, so it can size itself to fit
  const { width: graphWidth, containerRef: graphContainerRef, triggerResize } = useContainerSize();

  // Resize the graph when the parent container tells us to
  const { resizeDelay, shouldResize } = useContainerResize();

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerResize();
    }, resizeDelay);
    return () => clearTimeout(timer);
  }, [shouldResize]);

  const numRows = innerRows.length;
  const spaceValue = barSpacing ?? BAR_SPACING;
  const barSpacingValue = numRows > 1 ? spaceValue : 0;
  const graphHeight = numRows * (rowHeight + barSpacingValue) + graphPadding.top;

  // Create a flat list of bars from all rows for Victory to plot
  const flattenBars = innerRows.reduce((acc, row) => {
    return [...acc, ...row.bars];
  }, [] as BarPeriod[]);

  const bars = zoomIn(brush?.zoomedDomain?.x, cloneDeep(flattenBars));
  const hasData = bars.length > 0 ? true : false;

  // Specify row orer for Victory
  const rowOrder = innerRows.length ? innerRows.map((row) => row.state) : [];

  return (
    <GraphContainer ref={graphContainerRef}>
      {!hasData && <div className="no_data_graph">No data</div>}
      {hasData && (
        <VictoryChart
          containerComponent={
            <VictoryVoronoiBrushContainer
              allowDraw={hasZoom}
              allowDrag={false}
              brushDimension="y"
              brushStyle={{
                stroke: 'transparent',
                fill: 'black',
                fillOpacity: zooming ? 0.1 : 0
              }}
              // Clear previously selected area
              defaultBrushArea="none"
              mouseFollowTooltips
              onBrushDomainChange={() => {
                brush?.onBrushDomainChange && brush?.onBrushDomainChange();
              }}
              onBrushDomainChangeEnd={(d) => {
                // Skip if the domain doesn't change,
                // ...this is likely to happen when the user clicks on the chart without dragging
                if (d.x[0] == 0) return;
                brush?.onBrushDomainChangeEnd({ x: d.y as DateTuple });
              }}
              style={{ height: 'auto' }}
            />
          }
          domain={
            brush?.zoomedDomain?.x
              ? {
                  y: brush.zoomedDomain.x
                }
              : undefined
          }
          domainPadding={{ x: rowHeight / 2 }}
          height={graphHeight}
          horizontal
          // Adding key to reset <VictoryBrushContainer /> after resize
          key={`chart-${graphHeight}`}
          padding={graphPadding}
          scale={{ y: 'time' }}
          theme={victoryTheme}
          width={graphWidth}
        >
          <VictoryAxis
            style={{
              axis: {
                stroke: 'none'
              }
            }}
            tickLabelComponent={
              <TickLabelYComponent
                hideSubStepIds={hideSubStepIds}
                padding={graphPadding}
                rows={innerRows}
                rowHeight={rowHeight}
                onClick={onLabelClick}
              />
            }
          />
          <SyncVictoryAxis
            dependentAxis
            orientation="top"
            tickFormat={(t) =>
              isUSTimeZone(getUserTimeZone())
                ? `${formatDate(t, 'hours-minutes', timeZone, 'en-US', true)}\n${formatDate(
                    t,
                    'numeric-month-day',
                    timeZone,
                    'en-US'
                  )}`
                : `${formatDate(t, 'hours-minutes', timeZone)}\n${formatDate(
                    t,
                    'numeric-month-day',
                    timeZone
                  )}`
            }
            style={{
              tickLabels: {
                padding: tickLabelPadding
              },
              grid: {
                stroke: theme.colors.lightGrey3
              },
              axis: {
                stroke: 'none'
              }
            }}
            zoomed={brush?.zoomedDomain?.x !== undefined}
            startTime={startTime}
            endTime={endTime}
            sync={syncAxis}
            bars={bars}
          />

          <VictoryBar
            data={bars}
            y="endTime"
            y0="startTime"
            x="state"
            barWidth={rowHeight}
            categories={{ x: rowOrder as string[] }}
            style={{
              data: {
                stroke: 'white',
                strokeWidth: intervalSpacing ?? INTERVAL_SPACING,
                fill: ({ datum }) => datum.color
              }
            }}
            labels={({ datum }) => datum.toolTipData}
            labelComponent={
              <VictoryTooltip
                cornerRadius={4}
                flyoutHeight={90}
                flyoutWidth={200}
                flyoutStyle={{
                  strokeWidth: 1,
                  fill: 'white',
                  fillOpacity: 0.8,
                  pointerEvents: 'none',
                  stroke: theme.colors.lightGrey5
                }}
                constrainToVisibleArea
                labelComponent={customTooltip || <DefaultTooltip />}
              />
            }
          />

          {spanPeriodsRenderer(spanPeriods || [], graphHeight, customTooltip || <DefaultTooltip />)}

          {trackingLines?.map((trackingLine) => (
            <TrackingLinesComponent
              datum={trackingLine}
              key={trackingLine.id}
              height={graphHeight}
              topPadding={padding && padding.top ? padding.top : 0}
            />
          ))}
        </VictoryChart>
      )}
      {scatterChartData && (
        <ScatterChart
          data={scatterChartData.data}
          title={scatterChartData.title ? scatterChartData.title : ''}
        />
      )}
    </GraphContainer>
  );
};

export default StateOverTimeChart;
