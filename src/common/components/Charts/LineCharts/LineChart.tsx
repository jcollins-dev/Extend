import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { ChartAxisWrapperProps } from './ChartAxisWrapper/ChartAxisWrapper';

export interface LinePathProps extends ChartAxisWrapperProps {
  data?: Record<string, unknown>[];
  /** the color of this line */
  color?: string;
  /** key that will be used to plot the verticle positions, typically date */
  valueKey?: string;
  /** the key that will be used to plot the horizontal positions, typically date */
  groupKey?: string;
}

export const LinePath = ({
  width,
  height,
  data,
  color,
  dateRangeDomain,
  valueKey,
  groupKey
}: LinePathProps): JSX.Element => {
  // return nothing if reqs aren't met, to avoid any crashes
  if (!width || !height || !data) return <></>;
  // set some defaults to also avoid crashes
  valueKey = valueKey || 'value';
  color = color || '#cb1dd1';
  // draw the line and cache it
  const Line = useMemo(() => {
    const [startIso, endIso] = dateRangeDomain || ['2021-01-01', '2021-01-31'];

    // X axis
    const xScale = d3
      .scaleUtc()
      .domain([new Date(startIso), new Date(endIso)])
      .range([0, width]);

    // Y axis
    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Build the line
    const lineBuilder = d3
      .line<Record<string, unknown>>()
      .x((d) => xScale(new Date(d[groupKey as string] as string)))
      .y((d) => yScale(d[valueKey as string] as number));

    const linePath = lineBuilder(data) as string;

    return <path d={linePath} stroke={color} fill="none" strokeWidth={1.5} />;
  }, [data, width, height]);

  return Line;
};
