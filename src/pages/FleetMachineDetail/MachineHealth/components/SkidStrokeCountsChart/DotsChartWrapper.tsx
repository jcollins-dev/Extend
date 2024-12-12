import React, { useEffect, useRef, useState } from 'react';
import D3DotsChart from './DotsChart';
import { DoctsChartContainer } from './DotsChart.elements';

interface Props {
  data: Record<string, unknown>[];
  data2: Record<string, unknown>[];
  tooltipData: Record<string, unknown>[];
  height: number;
  width: number;
  index?: number;
}

export const DotsChartWrapper = ({
  data,
  data2,
  tooltipData,
  height,
  width,
  index
}: Props): JSX.Element => {
  const chartArea = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState();

  const settings = {
    data,
    data2,
    tooltipData,
    height,
    width
  };

  useEffect(() => {
    if (!chart) {
      //@ts-expect-error: error
      setChart(new D3DotsChart(chartArea.current, { ...settings }));
    } else {
      //@ts-expect-error: error
      chart.update(data, data2, tooltipData);
    }
  }, [chart]);

  useEffect(() => {
    //@ts-expect-error: error
    setChart(new D3DotsChart(chartArea.current, { ...settings }));
  }, [width]);

  return (
    <DoctsChartContainer style={{ width: width }}>
      <div
        style={{ width: width }}
        className={`chart-area dots-chart-${index}`}
        ref={chartArea}
      ></div>
    </DoctsChartContainer>
  );
};
