import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface ChartAxisWrapperProps {
  width?: number;
  height?: number;
  leftDomain?: number[];
  bottomDomain?: number[];
  dateRangeDomain?: string[];
  leftTicks?: number;
  bottomTickCount?: number;
  /** this is used to cal */
  children?: React.ReactNode;
  Chart?: (x?: Record<string, unknown>) => JSX.Element;
  axisSize?: number;
  axisMargins?: {
    t?: number;
    r?: number;
    b?: number;
    l?: number;
  };
}

export const ChartAxisWrapper = ({
  width,
  height,
  dateRangeDomain,
  bottomTickCount,
  Chart,
  axisMargins
}: ChartAxisWrapperProps): JSX.Element => {
  const marginTop = axisMargins?.t || 20;
  const marginRight = axisMargins?.r || 20;
  const marginBottom = axisMargins?.b || 20;
  const marginLeft = axisMargins?.l || 20;

  // set some defaults
  width = width || 700;
  height = height || 300;
  // deconstruct dateRange to get iso timstamps
  const [startIso, endIso] = dateRangeDomain || ['2023-09-07', '2023-09-11'];
  // convert to date objects for D3
  const start = new Date(startIso);
  const end = new Date(endIso);

  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const axisLeftRef = useRef(null);
  const axisBottomRef = useRef(null);
  const gridLinesRef = useRef(null);

  const dataAreaWidth = width - marginRight - marginLeft;
  const dataAreaHeight = height - marginTop - marginBottom;

  // Y / left axis
  const yScale = d3.scaleLinear().domain([0, 100]).range([dataAreaHeight, 0]);

  // X / bottom axis
  const xScale = d3.scaleUtc().domain([start, end]).range([0, dataAreaWidth]);

  useEffect(() => {
    // select the SVG Elements to popuplate
    const axisLeftEl = d3.select(axisLeftRef.current);
    const axisBottomEl = d3.select(axisBottomRef.current);
    const gridLinesEl = d3.select(gridLinesRef.current);

    // we're going to use d3 to add ths axis items
    const xAxisGenerator = d3.axisBottom(xScale).ticks(bottomTickCount);
    const yAxisGenerator = d3.axisLeft(yScale).ticks(5);

    // clear the other elements to prevent double rendering
    axisLeftEl.selectAll('*').remove();
    axisBottomEl.selectAll('*').remove();
    gridLinesEl.selectAll('*').remove();

    // left
    axisLeftEl
      .append('g')
      .attr('class', 'tick')
      .call(
        yAxisGenerator.tickFormat((label: d3.NumberValue, i: number): string => {
          console.log({ label, i });
          return String(label);
        })
      );

    // bottom
    axisBottomEl.append('g').attr('class', 'tick').call(xAxisGenerator);

    // grid lines
    gridLinesEl
      .append('g')
      .attr('class', 'tick horz')
      .call(xAxisGenerator.tickSize(dataAreaHeight).tickFormat(() => ''));

    gridLinesEl
      .append('g')
      .attr('class', 'tick vert')
      .attr('transform', `translate(${dataAreaWidth},0)`)
      .call(yAxisGenerator.tickSize(dataAreaWidth).tickFormat(() => ''));
  }, [xScale, yScale, dataAreaHeight, dataAreaWidth]);

  // group defs for pos and populat
  const axisLeftGroup = {
    className: 'chart axis left',
    ref: axisLeftRef,
    width: marginLeft,
    height: dataAreaHeight,
    transform: `translate(${marginLeft}, ${marginTop})`
  };

  const axisBottomGroup = {
    className: 'chart axis bottom',
    ref: axisBottomRef,
    height: marginBottom,
    width: dataAreaWidth,
    transform: `translate(${marginLeft},${dataAreaHeight + marginTop})`
  };

  const gridLinesGroup = {
    className: 'chart grid-lines',
    ref: gridLinesRef,
    height: dataAreaHeight,
    width: dataAreaWidth,
    opacity: 0.1,
    transform: `translate(${marginLeft},${marginTop})`
  };

  const chartGroup = {
    className: 'chart data-area',
    height: dataAreaHeight,
    width: dataAreaWidth,
    transform: `translate(${marginLeft},${marginTop})`
  };

  return (
    <svg width={width} height={height}>
      <g {...gridLinesGroup} />
      <g {...axisLeftGroup} />
      <g {...axisBottomGroup} />
      {Chart && (
        <g {...chartGroup}>
          <Chart {...{ width: dataAreaWidth, height: dataAreaHeight, axisMargins }} />
        </g>
      )}
    </svg>
  );
};
