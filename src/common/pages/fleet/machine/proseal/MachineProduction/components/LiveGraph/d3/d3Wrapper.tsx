import React, { useEffect, useRef, useState } from 'react';
import D3Chart from './d3';
import { testdata } from './demoData/data';
import { DimensionsContainer } from 'components';
import { D3WrapperContainer } from './d3Wrapper.elements';
import { LiveChartActionButtons } from 'common/pages/fleet/machine/proseal/MachineProduction/components/LiveChartActionButtons/LiveChartActionButtons';

interface D3Wrapper {
  width: number;
  height?: number;
  isLabelVisible: boolean;
}

export const D3Wrapper = ({ width, height, isLabelVisible }: D3Wrapper): JSX.Element => {
  const chartArea = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState();

  const [chartWidth, setChartWidth] = useState<number>(width);

  useEffect(() => {
    setChartWidth(width);
  }, [width]);

  //  API data HERE
  const dataFormattedDate = testdata.live_data.map((e) => ({
    ...e,
    timestamp: new Date(e.timestamp)
  }));

  //Data transformation for our chart
  const arrayOfLines = [];
  let startIndex = 0;
  let endIndex = 1;

  for (let i = 0; i < dataFormattedDate.length; i++) {
    const currItem = dataFormattedDate[i];
    const nextItem = dataFormattedDate[i + 1];
    if (nextItem && currItem.recipe == nextItem.recipe) continue;
    if (!nextItem) {
      arrayOfLines.push(dataFormattedDate.slice(startIndex, dataFormattedDate.length - 1));
    } else {
      endIndex = i + 1;
      arrayOfLines.push(dataFormattedDate.slice(startIndex, endIndex));
      startIndex = i + 1;
    }
  }

  const line1 = {
    data: dataFormattedDate,
    xSelector: 'timestamp',
    ySelector: 'ppm'
  };

  const line2 = {
    data: arrayOfLines,
    xSelector: 'timestamp',
    ySelector: 'ideal_ppm'
  };

  const line3 = {
    data: arrayOfLines,
    xSelector: 'timestamp',
    ySelector: 8
  };

  const chartSettings = {
    chartMargins: {
      top: 75,
      bottom: 20,
      left: 40,
      right: 20
    },
    xMainAxisSelector: 'timestamp',
    yMainAxisSelector: 'ppm',
    isLabelVisible,
    numberofLabels: 5,
    dataLines: [
      {
        lineName: 'line1',
        lineSettings: line1
      },
      {
        lineName: 'line2',
        lineSettings: line2
      },
      {
        lineName: 'line3',
        lineSettings: line3
      }
    ]
  };

  useEffect(() => {
    //@ts-expect-error: error
    setChart(new D3Chart(chartArea.current, chartWidth, height, { ...chartSettings }));
  }, [chartWidth]);

  useEffect(() => {
    if (!chart) {
      //@ts-expect-error: error
      setChart(new D3Chart(chartArea.current, chartWidth, height, { ...chartSettings }));
    } else {
      //@ts-expect-error: error
      chart.update();
    }
  }, [chart]);

  return (
    <D3WrapperContainer>
      <div className="chart-area" style={{ height: height }} ref={chartArea}></div>
    </D3WrapperContainer>
  );
};

export const LiveGraphBigChart = (): JSX.Element => {
  const [showLabels, setShowLabels] = useState<boolean>(false);

  const handleLabelsShow = () => setShowLabels(!showLabels);

  return (
    <>
      <LiveChartActionButtons onShowLabels={handleLabelsShow} showLabels={showLabels} />
      <DimensionsContainer
        Component={({ width, height }) => {
          return <D3Wrapper width={width} height={height} isLabelVisible={showLabels} />;
        }}
      />
    </>
  );
};
