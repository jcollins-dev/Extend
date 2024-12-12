// 3rd party libs
import React, { useState, useMemo } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryStack } from 'victory';
import moment from 'moment';

// Theme
import victoryTheme from 'themes/victory';
import theme from 'themes';

// Components
import { ChartToolTip } from 'components';

// Helpers
import { DateRange, formatDate } from 'helpers';

interface ToolTipContent {
  count?: number;
  day?: string;
  label?: string;
}

export interface BarDatum {
  y: number;
  x: Date;
  name: string | undefined;
  id: string;
  color?: string;
  toolTipData: ToolTipContent;
  label?: string;
}

export interface ToolTipState {
  x: number;
  y: number;
  data: Record<string, unknown>;
}

export interface Props {
  stackedData: BarDatum[][];
  width: number;
  height: number;
  onBarClick?: (datum: BarDatum) => void;
  renderToolTipContent?: (content: Record<string, unknown>) => React.ReactNode;
  dateRange?: DateRange;
  timeZone?: string;
}

const PADDING = {
  top: 5,
  left: 50,
  right: 30,
  bottom: 30
};

const X_DOMAIN_PADDING = 5;
const BAR_SPACING = 1;
const MAX_BAR_WIDTH = 25;
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

export const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const StackedBarChartOverTime = ({
  stackedData,
  width,
  height,
  onBarClick,
  dateRange,
  renderToolTipContent
}: Props): JSX.Element => {
  // Ref to chart container allows us to find its position on the page (using getBoundingClientRect)
  const chartRef = React.useRef<HTMLDivElement>(null);

  const [toolTipState, setToolTipState] = useState<ToolTipState | null>(null);

  const showTooltip = (
    x: number,
    barWidth: number,
    y: number,
    y0: number,
    data: Record<string, unknown>
  ) => {
    // Calculate y position of the tooltip (with respect to the chart container)
    const yPos = (y - y0) / 2 + y0;
    const xPos = x + barWidth / 2;
    // Get the position of the chart on the page
    const chartPosition = chartRef.current?.getBoundingClientRect();

    if (chartPosition) {
      // Set the absolute tooltip position on the page
      setToolTipState({
        x: window.scrollX + chartPosition.left + xPos,
        y: window.scrollY + chartPosition.top + yPos,
        data
      });
    }
  };

  // Victory does not size bars correctly if there are gaps in the data, so we calculate
  // bar width manually
  const { maxX, barWidth } = useMemo(() => {
    const minX = Math.min(...stackedData.map((d) => Math.min(...d.map((d) => d.x.getTime()))));
    const maxX = Math.max(...stackedData.map((d) => Math.max(...d.map((d) => d.x.getTime()))));

    const dayRange = Math.ceil((maxX - minX) / DAY_IN_MILLISECONDS);
    // Add one because days are from midnight, so e.g. a range of 9 days would be 10 bars
    const numBars = dayRange + 1;

    let barWidth =
      (width - PADDING.left - PADDING.right - X_DOMAIN_PADDING) / numBars - BAR_SPACING;

    if (barWidth > MAX_BAR_WIDTH) {
      barWidth = MAX_BAR_WIDTH;
    }

    return { maxX, minX, barWidth };
  }, [stackedData, width]);

  const domain: { x: [Date, Date] } | undefined = useMemo(() => {
    return dateRange
      ? {
          x: [
            dateRange.from ? moment(dateRange.from).toDate() : new Date(2000, 1, 1),
            // Extra day at the tail end ensures no bar chart will be over upper bound of the selected date range
            dateRange.to ? moment(dateRange.to).add(1, 'day').toDate() : new Date(2000, 1, 2)
          ]
        }
      : undefined;
  }, [dateRange]);
  const maxDomain = dateRange ? undefined : { x: maxX + DAY_IN_MILLISECONDS };

  return (
    <div ref={chartRef}>
      <VictoryChart
        scale={{ x: 'time' }}
        maxDomain={maxDomain}
        domain={domain}
        theme={victoryTheme}
        height={height}
        width={width}
        padding={PADDING}
        domainPadding={{ x: X_DOMAIN_PADDING }}
      >
        <VictoryStack>
          {stackedData.map((data, i) => {
            return (
              <VictoryBar
                data={data}
                key={i}
                labels={({ datum }) => datum.label}
                labelComponent={
                  <VictoryLabel
                    dx={12}
                    dy={({ datum }) => (datum.y > 2 ? 10 : 5)}
                    backgroundPadding={7}
                    style={{
                      fill: theme.colors.white,
                      fontSize: '10',
                      fontWeight: 'bold',
                      pointerEvents: 'none',
                      opacity: ({ datum }) => (datum.hidden ? 0 : 1)
                    }}
                  />
                }
                barWidth={barWidth}
                alignment="start"
                style={{
                  data: {
                    fill: ({ datum }) => datum.color,
                    cursor: 'pointer'
                  }
                }}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onMouseOver: (_, obj) => {
                        showTooltip(
                          obj.scale.x(obj.datum.x),
                          barWidth,
                          obj.y,
                          obj.y0,
                          obj.datum.toolTipData
                        );
                      },
                      onMouseOut: () => {
                        setToolTipState(null);
                      },
                      onClick: (_, obj) => {
                        onBarClick && onBarClick(obj.datum);
                      }
                    }
                  }
                ]}
              />
            );
          })}
        </VictoryStack>
        <VictoryAxis dependentAxis tickFormat={(tick) => formatter.format(tick)} />
        <VictoryAxis tickFormat={(tick) => formatDate(tick, 'numeric-month-day')} />
      </VictoryChart>
      {toolTipState && toolTipState.data && renderToolTipContent && (
        <ChartToolTip
          x={toolTipState.x}
          y={toolTipState.y}
          content={renderToolTipContent(toolTipState.data)}
        />
      )}
    </div>
  );
};

export default StackedBarChartOverTime;
