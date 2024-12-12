// 3rd party libs
import React, { useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

// Theme
import victoryTheme from 'themes/victory';

// Components
import { ChartToolTip } from 'components';

// Helpers
import { formatDate } from 'helpers';

// Types
import { BarDatum } from './';

interface ToolTipState {
  x: number;
  y: number;
  data: Record<string, unknown>;
}

interface Props {
  bars: BarDatum[];
  width: number;
  height: number;
  onBarClick?: (datum: BarDatum) => void;
  renderToolTipContent?: (content: Record<string, unknown>) => React.ReactNode;
  timeZone?: string;
  numSessions: number;
  sessionIdToDateMap: Record<string, Date>;
  categories: string[];
}

// Minimum horizontal space needed for each x axis label.
// If there are too many bars/ticks for this minimum width to be met, some tick labels will be hidden.
const MIN_TICK_LABEL_WIDTH = 15;

const PADDING = {
  top: 5,
  left: 50,
  right: 30,
  bottom: 130
};

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const Chart = ({
  bars,
  width,
  height,
  numSessions,
  onBarClick,
  renderToolTipContent,
  timeZone,
  sessionIdToDateMap,
  categories
}: Props): JSX.Element => {
  // Ref to chart container allows us to find its position on the page (using getBoundingClientRect)
  const chartRef = React.useRef<HTMLDivElement>(null);

  const [toolTipState, setToolTipState] = useState<ToolTipState | null>(null);

  const showTooltip = (x: number, y: number, y0: number, data: Record<string, unknown>) => {
    // Calculate y position of the tooltip (with respect to the chart container)
    const yPos = (y - y0) / 2 + y0;

    // Get the position of the chart on the page
    const chartPosition = chartRef.current?.getBoundingClientRect();

    if (chartPosition) {
      // Set the absolute tooltip position on the page
      setToolTipState({
        x: window.scrollX + chartPosition.left + x,
        y: window.scrollY + chartPosition.top + yPos,
        data
      });
    }
  };

  let barWidth = (width - PADDING.left - PADDING.right) / numSessions + 1 - 4;
  barWidth = Math.min(Math.max(barWidth, 1), 30);

  // Remove some tick labels if we have run out of room
  const fixLabelOverlap =
    (width - PADDING.left - PADDING.right) / numSessions < MIN_TICK_LABEL_WIDTH;

  return (
    <div ref={chartRef}>
      <VictoryChart
        theme={victoryTheme}
        height={height}
        width={width}
        padding={PADDING}
        domainPadding={{ x: barWidth / 2 }}
      >
        <VictoryBar
          data={bars}
          barWidth={barWidth}
          categories={{ x: categories }}
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
                  showTooltip(obj.x, obj.y, obj.y0, obj.datum.toolTipData);
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
        <VictoryAxis dependentAxis tickFormat={(tick) => formatter.format(tick)} />
        <VictoryAxis
          tickFormat={(tick) => {
            const date = sessionIdToDateMap[tick];
            return formatDate(date, 'numeric-date-time', timeZone);
          }}
          fixLabelOverlap={fixLabelOverlap}
          style={{
            tickLabels: {
              angle: -75,
              textAnchor: 'end',
              verticalAnchor: 'middle',
              transform: 'translate(-6, 0)'
            }
          }}
        />
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

export default Chart;
