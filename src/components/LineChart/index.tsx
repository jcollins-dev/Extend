// 3rd Party Libraries
import React, { useMemo, useState } from 'react';
import {
  createContainer,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryBrushContainerProps,
  VictoryVoronoiContainerProps
} from 'victory';
import styled from 'styled-components';
import victoryTheme from 'themes/victory';
import theme from 'themes';

// Helpers
import { formatDate } from 'helpers';

// Providers
import { useTimeZone } from 'providers';

// Types
import { DateTuple, NumberTuple } from 'types';
import { ActionButton } from 'components';

const StyledResetContainer = styled.div`
  align-self: end;
  height: 0;
  padding: 1rem 1rem 0 0;
  width: 6.75rem;
  z-index: 99;
`;

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const VictoryBrushCursorContainer = createContainer<
  VictoryBrushContainerProps,
  VictoryVoronoiContainerProps
>('brush', 'voronoi');

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: { x: number | Date; y: number; label?: string }[];
  height?: number;
  width?: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  strokeColor?: string;
  maxDomain?: { x: number; y: number };
  minDomain?: { x: number; y: number };
  leftLabel?: { title: string; height: number };
  rightLabel?: { title: string; height: number };

  isVisibleAxis?: { x: boolean; y: boolean };
  isAxisRounded?: boolean;
  tickValues?: { x: number[]; y: number[] };
  isVisibleScatter?: boolean;
  // Custom element to be plotted on the graph
  custom?: JSX.Element;
  isZoomEnabled?: boolean;
}

const LineChart = ({
  data,
  strokeColor,
  maxDomain,
  minDomain,
  leftLabel,
  rightLabel,
  height,
  width,
  isVisibleAxis,
  isAxisRounded,
  tickValues,
  isVisibleScatter,
  isZoomEnabled = false,
  padding,
  custom
}: Props): JSX.Element => {
  const { timeZone } = useTimeZone();

  const brushDomain: [Date, Date] = useMemo(() => {
    const firstDate = typeof data[0].x === 'number' ? new Date(data[0].x) : data[0].x;
    const lastDate =
      typeof data[data.length - 1].x === 'number'
        ? new Date(data[data.length - 1].x as number)
        : (data[data.length - 1].x as Date);

    return [firstDate, lastDate];
  }, [data]);

  // Not zoomed by default
  const [zoomedDomain, setZoomedDomain] = useState<{
    x: DateTuple;
    y: NumberTuple | undefined;
  }>({
    x: brushDomain,
    y: undefined
  });

  // True - when an area is being selecting
  const [zooming, setZooming] = useState(false);

  const resetZoom = () => {
    setZoomedDomain({
      x: brushDomain,
      y: undefined
    });
  };

  const chartHeight = height ? height : 500;
  const chartPadding = padding
    ? padding
    : {
        top: 20,
        right: 50,
        bottom: 30,
        left: 50
      };

  return (
    <>
      {isZoomEnabled && (
        <StyledResetContainer>
          <ActionButton onClick={resetZoom} hideArrow>
            Reset zoom
          </ActionButton>
        </StyledResetContainer>
      )}
      <VictoryChart
        domain={isZoomEnabled ? zoomedDomain : undefined}
        theme={victoryTheme}
        height={chartHeight}
        width={width ? width : 500}
        padding={chartPadding}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryBrushCursorContainer
            labels={({ datum }) =>
              `${formatter.format(datum.y)} - ${formatDate(
                new Date(datum.x),
                'numeric-date-time',
                timeZone
              )}`
            }
            defaultBrushArea="none"
            allowDrag={isZoomEnabled}
            allowDraw={isZoomEnabled}
            brushStyle={{
              stroke: 'transparent',
              fill: 'black',
              fillOpacity: zooming ? 0.1 : 0,
              cursor: !isZoomEnabled ? 'auto' : undefined
            }}
            onBrushDomainChangeEnd={(domain) => {
              // Skip if the domain doesn't change,
              // ...this is likely to happen when the user clicks on the chart without dragging
              if (domain.x[0] == 0) return;

              if (isZoomEnabled) {
                setZoomedDomain({
                  x: domain.x as DateTuple,
                  y: domain.y as NumberTuple
                });
              }
              setZooming(false);
            }}
            onBrushDomainChange={() => {
              if (!zooming && isZoomEnabled) setZooming(true);
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={4}
                flyoutWidth={({ text }) => {
                  const textArray = text as string[] | undefined;
                  if (!textArray || textArray.length > 1) {
                    return 150;
                  } else {
                    return textArray[0].length * 6.5;
                  }
                }}
                flyoutHeight={({ text }) => (text as string[]).filter(String).length * 30}
                flyoutStyle={{
                  strokeWidth: 1,
                  fill: 'white',
                  fillOpacity: 0.8,
                  pointerEvents: 'none',
                  stroke: theme.colors.lightGrey5
                }}
                constrainToVisibleArea
              />
            }
          />
        }
      >
        <VictoryLine
          maxDomain={maxDomain}
          minDomain={minDomain}
          data={data}
          interpolation="monotoneX"
          style={{ data: { stroke: strokeColor ? strokeColor : theme.colors.darkGrey } }}
        />
        {isVisibleScatter && (
          <VictoryScatter
            data={[data[data.length - 1]]}
            size={5}
            style={{ data: { fill: theme.colors.darkGrey } }}
          />
        )}
        {leftLabel && (
          <VictoryLabel
            x={10}
            y={chartHeight}
            text={leftLabel.title}
            style={{
              fill: theme.colors.mediumBlue2,
              fontSize: 8,
              fontFamily: theme.typography.family
            }}
          />
        )}
        {rightLabel && (
          <VictoryLabel
            x={width ? width - 55 : 500}
            y={chartHeight}
            text={rightLabel.title}
            style={{
              fill: theme.colors.mediumBlue2,
              fontSize: 8,
              fontFamily: theme.typography.family
            }}
          />
        )}
        {!isVisibleAxis ||
          (isVisibleAxis && isVisibleAxis.y && (
            <VictoryAxis
              tickValues={tickValues && tickValues.y}
              tickFormat={
                isAxisRounded
                  ? (t) => `${Math.round(t).toLocaleString()}`
                  : (t) => `${t.toLocaleString()}`
              }
              style={{
                axis: { stroke: theme.colors.white },
                axisLabel: { fontSize: 8, fill: theme.colors.mediumGrey2 },
                ticks: { stroke: theme.colors.mediumGrey2 },
                tickLabels: { fontSize: 8, fill: theme.colors.mediumGrey2 },
                grid: {
                  stroke: theme.colors.mediumGrey2,
                  strokeWidth: 0.25,
                  strokeDasharray: '4, 8'
                }
              }}
              dependentAxis
            />
          ))}
        {!isVisibleAxis ||
          (isVisibleAxis && isVisibleAxis.x && (
            <VictoryAxis
              tickValues={tickValues && tickValues.y}
              style={{
                axis: { stroke: theme.colors.white },
                axisLabel: { fontSize: 8, fill: theme.colors.mediumGrey2 },
                ticks: { stroke: theme.colors.mediumGrey2 },
                tickLabels: { fontSize: 8, fill: theme.colors.mediumGrey2 },
                grid: {
                  stroke: theme.colors.mediumGrey2,
                  strokeWidth: 0.25,
                  strokeDasharray: '4, 8'
                }
              }}
            />
          ))}
        {custom}
      </VictoryChart>
    </>
  );
};

export default LineChart;
