// 3rd party libs
import React, { useState } from 'react';
import { VictoryPie, VictoryLabel, VictoryContainer } from 'victory';

// Components
import { ChartToolTip } from 'components';

// Types
import { ChartToolTipProps } from 'components/ChartToolTip';

// Theme
import theme from 'themes';

export interface PieSliceDatum {
  id: string;
  label?: string;
  percent: number;
  color: string;
  tooltip?: React.ReactNode;
  hidden?: boolean;
  // Highlight slice
  highlight?: boolean;
}

interface Props {
  data: PieSliceDatum[];
  onSliceClick?: (datum: PieSliceDatum) => void;
}

const RADIUS = 90;
const PADDING = { top: 10, left: 30, right: 30, bottom: 30 };
const MIN_SIZE_SHOW_LABEL = 12;

const PieChart = ({ data, onSliceClick }: Props): JSX.Element => {
  // Ref to chart container allows us to find its position on the page (using getBoundingClientRect)
  const chartRef = React.useRef<HTMLDivElement>(null);

  const [toolTipState, setToolTipState] = useState<ChartToolTipProps | null>(null);

  /**
   * Shows a tooltip for a pie slice.
   * The posiiton is calculated by the provided angles of the slice.
   */
  const showTooltip = (startAngle: number, endAngle: number, content: React.ReactNode) => {
    // How far from the centre should the tooltip locate
    const toolTipPositionRadius = RADIUS * 0.5;

    // The arc of the slice that has been selected, in degrees
    const arcDegs = endAngle - startAngle;

    // Angle at the center of the arc, in degrees
    const angleDegs = startAngle + arcDegs / 2;

    // Convert to radians
    const angleRads = (angleDegs / 180) * Math.PI;

    // Calculate x/y position of the tooltip (with respect to the chart container)
    const x = toolTipPositionRadius * Math.sin(angleRads);
    const y = toolTipPositionRadius * Math.cos(angleRads);

    // Get the position of the chart on the page
    const chartPosition = chartRef.current?.getBoundingClientRect();

    if (chartPosition) {
      // Set the absolute tooltip position on the page
      setToolTipState({
        x: chartPosition.left + window.scrollX + PADDING.left + RADIUS + x,
        y: chartPosition.top + window.scrollY + PADDING.top + RADIUS - y,
        content
      });
    }
  };

  const transformedData = () =>
    data.map((a) => ({ ...a, label: `${parseFloat(a.label ?? '').toFixed(1)}%` }));

  return (
    <>
      <div ref={chartRef}>
        <VictoryPie
          containerComponent={<VictoryContainer responsive={false} />}
          y="percent"
          labelRadius={RADIUS * 0.65}
          width={RADIUS * 2 + PADDING.left + PADDING.right}
          height={RADIUS * 2 + PADDING.top + PADDING.bottom}
          padding={PADDING}
          data={transformedData()}
          labelComponent={
            <VictoryLabel
              backgroundComponent={<rect ry={5} rx={5} />}
              backgroundPadding={5}
              backgroundStyle={{
                fill: theme.colors.black,
                opacity: ({ datum }) =>
                  datum.hidden || datum.percent < MIN_SIZE_SHOW_LABEL ? 0 : 0.5,
                pointerEvents: 'none'
              }}
              style={{
                fill: theme.colors.white,
                fontSize: '10',
                pointerEvents: 'none',
                opacity: ({ datum }) =>
                  datum.hidden || datum.percent < MIN_SIZE_SHOW_LABEL ? 0 : 1
              }}
            />
          }
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: (_, obj) => {
                  showTooltip(obj.datum.startAngle, obj.datum.endAngle, obj.datum.tooltip);
                },
                onMouseOut: () => {
                  setToolTipState(null);
                },
                onClick: (_, obj) => {
                  onSliceClick && onSliceClick(obj.datum);
                }
              }
            }
          ]}
          style={{
            data: {
              fill: ({ datum }) => (datum.hidden ? 'transparent' : datum.color),
              cursor: 'pointer',
              stroke: ({ datum }) => datum.highlight && datum.color,
              strokeWidth: ({ datum }) => datum.highlight && 5,
              pointerEvents: ({ datum }) => (datum.hidden ? 'none' : 'auto')
            }
          }}
        />
      </div>
      {toolTipState && toolTipState.content && <ChartToolTip {...toolTipState} />}
    </>
  );
};

export default PieChart;
