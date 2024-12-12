// 3rd party libs
import React, { useState, useMemo } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel } from 'victory';
import moment from 'moment';

// Theme
import theme from 'themes';

// Components
import { ChartToolTip } from 'components';

// Helpers
import { Props, ToolTipState } from '.';
import { formatDate } from 'helpers';

export const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const PADDING2 = {
  top: 5,
  left: 50,
  right: 30,
  bottom: 30
};

const BAR_WIDTH = 15;

export const StackedBarChartOverTime2 = ({
  stackedData,
  width,
  height,
  onBarClick,
  dateRange,
  renderToolTipContent,
  timeZone
}: Props): JSX.Element => {
  // Ref to chart container allows us to find its position on the page (using getBoundingClientRect)
  const chartRef = React.useRef<HTMLDivElement>(null);

  const [toolTipState, setToolTipState] = useState<ToolTipState | null>(null);

  const showTooltip = (x: number, barWidth: number, y: number, data: Record<string, unknown>) => {
    const yPos = y;
    const xPos = x - barWidth / 2;

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

  const domain: { x: [Date, Date] } | undefined = useMemo(() => {
    return dateRange && timeZone
      ? {
          x: [
            dateRange.from ? moment(dateRange?.from).startOf('day').toDate() : new Date(),
            dateRange.to ? moment(dateRange?.to).startOf('day').toDate() : new Date()
          ]
        }
      : undefined;
  }, [dateRange]);

  const tickValues: Date[] | undefined = [];

  if (dateRange) {
    const from = moment(dateRange?.from);
    const to = moment(dateRange?.to);
    tickValues.push(from.toDate());
    while (from.add(1, 'days').diff(to) <= 0) {
      tickValues.push(from.clone().toDate());
    }
  }

  const Bars = stackedData.map((bar, i) => (
    <VictoryBar
      key={i}
      data={bar}
      barWidth={BAR_WIDTH}
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
              console.log('obj', obj);
              showTooltip(obj.x, BAR_WIDTH, obj.y, obj.datum.toolTipData);
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
  ));

  const Bottom = (
    <VictoryAxis
      scale={{ x: 'time' }}
      style={{
        tickLabels: {
          fontSize: 10
        }
      }}
      //fixLabelOverlap={false}
      tickCount={tickValues.length}
      //tickValues={tickValues}
      crossAxis={true}
      tickFormat={(tick) => formatAxisLabel(tick)}
    />
  );

  const Left = (
    <VictoryAxis
      dependentAxis={true}
      crossAxis={false}
      tickFormat={(tick) => formatter.format(tick)}
      style={{
        tickLabels: {
          fontSize: 10
        }
      }}
    />
  );

  return (
    <div ref={chartRef}>
      <VictoryChart
        height={height}
        width={width}
        scale={{ x: 'time' }}
        domain={domain}
        domainPadding={{ x: 10 }}
        padding={PADDING2}
      >
        {Bars}
        {Bottom}
        {Left}
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

const formatAxisLabel = (tick: string): string => {
  const t = new Date(Date.parse(tick)).toISOString();
  const tt = formatDate(t, 'numeric-month-day');
  return tt;
};
