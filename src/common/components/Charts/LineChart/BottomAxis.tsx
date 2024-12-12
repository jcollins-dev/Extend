import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BottomAxisProps {
  xScale: d3.ScaleTime<number, number>;
  height: number;
  tickFormat: (date: Date) => string;
}

export const BottomAxis = ({ xScale, height, tickFormat }: BottomAxisProps): JSX.Element => {
  const axisRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!axisRef.current) return;

    const axis = d3
      .axisBottom(xScale)
      .ticks(5) // You can adjust the number of ticks as needed
      .tickFormat((d) => tickFormat(d as Date));

    d3.select(axisRef.current).call(axis);
  }, [xScale, tickFormat]);

  return <svg ref={axisRef} width="100%" height={height} style={{ overflow: 'visible' }} />;
};

export default BottomAxis;
