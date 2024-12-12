import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { end } from '@popperjs/core';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

export interface AxisOverTimeProps {
  /** this should contain an array that has at least the following keys: { value, date, group, ...rest } */
  convertedData?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
  width?: number;
  height?: number;
  dateKey?: string;
}

export const AxisOverTime = ({ width, height, data, dateKey }: AxisOverTimeProps): JSX.Element => {
  if (!data) return <></>;

  // set some defaults
  // todo: make this responsive
  width = width || 1100;
  height = height || 300;

  dateKey = dateKey || 'date';

  const dates = data
    .map((d) => d?.[dateKey as string])
    .filter((d) => d)
    .sort() as string[];

  const startIso = dates[0];
  const endIso = dates[dates.length - 1];

  const start = new Date(startIso);
  const end = new Date(endIso);

  // Define custom tick values for x-axis
  const customYAxisTicks = [0, 20, 40, 60, 80, 100];

  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const axesRef = useRef(null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // X axis
  const xScale = useMemo(
    () => d3.scaleUtc().domain([start, end]).range([0, boundsWidth]),
    [boundsWidth, start, end]
  );

  // Y axis
  const yScale = useMemo(
    () => d3.scaleLinear().domain([0, 100]).range([boundsHeight, 0]),
    [boundsHeight]
  );

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);

    const generateLine = (data: { date: string; value: number }[]) => {
      const lineGenerator = d3
        .line<{ date: string; value: number }>()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.value) as number);

      return svgElement
        .append('path')
        .datum(data as { date: string; value: number }[])
        .attr('d', lineGenerator)
        .attr('fill', 'none') // You can customize the appearance as needed
        .attr('stroke', 'blue'); // Example stroke color
    };
    const xAxisGenerator = d3.axisBottom(xScale);
    const yAxisGenerator = d3.axisLeft(yScale);

    svgElement.selectAll('*').remove();

    // left
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator.ticks(5));

    // bottom
    svgElement.append('g').call(yAxisGenerator.tickValues(customYAxisTicks));

    generateLine(data as { date: string; value: number }[]);
  }, [xScale, yScale, boundsHeight]);

  // Build the circles
  const allCircles = data.map((item, i) => {
    return (
      <circle
        key={i}
        cx={xScale(new Date(item.date as string))}
        cy={yScale(item.value as number)}
        r={4}
        fill={'#cb1dd1'}
      />
    );
  });

  return (
    <div>
      <svg width={width} height={height} style={{ display: 'inline-block' }}>
        {/* first group is for the violin and box shapes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        ></g>
        {/* Second is for the axes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
        {allCircles}
      </svg>
    </div>
  );
};
