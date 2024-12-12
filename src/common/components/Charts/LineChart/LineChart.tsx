import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartProps {
  data: { value: number; date: string }[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Parse dates and values
    const parsedData = data.map((d) => ({
      value: d.value,
      date: new Date(d.date) // Parse date strings into Date objects
    }));

    // Define chart dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', svgRef.current.clientWidth)
      .attr('height', svgRef.current.clientHeight);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Define axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(7)
      .tickFormat((date) => {
        if (date instanceof Date) {
          return d3.timeFormat('%Y-%m-%d')(date);
        }
        return '';
      });

    const yAxis = d3.axisLeft(yScale).tickValues([0, 20, 40, 60, 80, 100]);

    // Add X-axis
    g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(xAxis);

    // Add Y-axis
    g.append('g').attr('class', 'y-axis').call(yAxis);

    // Create line generator
    const lineGenerator = d3
      .line<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value) as number);

    // Add the line
    g.append('path').datum(parsedData).attr('class', 'line').attr('d', lineGenerator);
  }, [data]);

  return <svg ref={svgRef} className="line-chart" />;
};

export default LineChart;
