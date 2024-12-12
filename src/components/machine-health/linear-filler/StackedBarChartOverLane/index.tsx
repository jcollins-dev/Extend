// 3rd party libs
import React, { useState } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryStack } from 'victory';

// Theme
import victoryTheme from 'themes/victory';
import theme from 'themes';

// Components
import { ChartToolTip } from 'components';

// Helpers
import { DateRange } from 'helpers';

export interface BarDatumLane {
  y: number;
  x: string;
  name: string;
  id: string;
  color?: string;
  toolTipData?: unknown;
  label?: string;
}

interface ToolTipState {
  x: number;
  y: number;
  data: Record<string, unknown>;
}

interface Props {
  stackedData: BarDatumLane[][];
  width: number;
  height: number;
  onBarClick?: (datum: BarDatumLane) => void;
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

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const StackedBarChartOverLane = ({
  stackedData,
  width,
  height,
  onBarClick,
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
    // Get the position of the chart on the page
    const chartPosition = chartRef.current?.getBoundingClientRect();

    if (chartPosition) {
      // Set the absolute tooltip position on the page
      setToolTipState({
        x: window.scrollX + chartPosition.left + x,
        y: window.scrollY + chartPosition.top + y,
        data
      });
    }
  };

  return (
    <div ref={chartRef}>
      <VictoryChart
        scale={{ x: 'time' }}
        theme={victoryTheme}
        height={height}
        width={width}
        padding={PADDING}
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
                        showTooltip(obj.x, 100, obj.y, obj.y0, obj.datum.toolTipData);
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
        <VictoryAxis tickFormat={(tick) => tick} />
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

export default StackedBarChartOverLane;
