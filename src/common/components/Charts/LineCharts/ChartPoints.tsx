import React, { useMemo, useContext } from 'react';
import * as d3 from 'd3';
import { ChartAxisWrapperProps } from './ChartAxisWrapper/ChartAxisWrapper';
import { TooltipContext } from '../ChartTooltipWrapper/ChartTooltipWrapper';

export interface ChartPointsProps extends ChartAxisWrapperProps {
  data?: Record<string, unknown>[];
  color?: string;
  valueKey?: string;
  groupKey?: string;
  isOutlined?: boolean;
}

export const ChartPoints = ({
  width,
  height,
  data,
  color,
  dateRangeDomain,
  valueKey,
  groupKey,
  isOutlined,
  axisMargins
}: ChartPointsProps): JSX.Element => {
  if (!width || !height || !data) return <></>;

  valueKey = valueKey || 'value';
  groupKey = groupKey || 'date';

  color = color || '#cb1dd1';

  const { setTooltip } = useContext(TooltipContext);

  const leftMarg = axisMargins?.l || 0;
  const topMarg = axisMargins?.t || 0;

  const Points = useMemo(() => {
    const [startIso, endIso] = dateRangeDomain || ['2021-01-01', '2021-01-31'];

    // X axis
    const xScale = d3
      .scaleUtc()
      .domain([new Date(startIso), new Date(endIso)])
      .range([0, width]);

    // Y axis
    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    return data.map((item, i) => {
      const posX = xScale(new Date(item[groupKey as string] as string));
      const posY = yScale(item[valueKey as string] as number);

      return (
        <circle
          key={i}
          cx={posX}
          cy={posY}
          r={3}
          fill={isOutlined ? 'white' : color}
          strokeWidth={isOutlined ? 2 : undefined}
          stroke={isOutlined ? color : undefined}
          onMouseOver={() => setTooltip({ left: posX + leftMarg, top: posY + topMarg, i, ...item })}
          onMouseLeave={() => setTooltip(undefined)}
        />
      );
    });
  }, [data, width, height]);

  return <>{Points}</>;
};
