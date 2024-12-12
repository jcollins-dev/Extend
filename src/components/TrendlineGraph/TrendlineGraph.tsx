import React, { ReactElement } from 'react';
import { VictoryArea, VictoryChart, VictoryAxis } from "victory";
import { TrendlineGraphProps } from '../../types';
import { default as theme } from '../../themes';

interface CustomClipProps {
  threshold: number;
  kpi: string;
  scale?: {
    y: (threshold: number) => number;
  };
}

const CustomClip = ({ ...props }: CustomClipProps) => {
  const { scale, threshold, kpi } = props;
  return (
    <defs key="clips">
      <clipPath id={`clip-path-${kpi}-1`}>
        <rect x="0" y="0" width="100%" height={scale?.y(threshold) || 0} />
      </clipPath>
      <clipPath id={`clip-path-${kpi}-2`}>
        <rect x="0" y={scale?.y(threshold) || 0} width="100%" height="100%" />
      </clipPath>
    </defs>
  );
};

// calculate the appropriate order of magnitude (10, 100, 1000, etc)
const getMagnitude = (n:number): number =>{
  const order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001); // because float math 
  return Math.pow(10, order);
}

const TrendlineGraph = ({
  kpi,
  graphData,
  threshold
}: TrendlineGraphProps): ReactElement => {
  let domainMin = 0;
  let domainMax = 0;
  let magnitude = 0;
  
  graphData.forEach((datum) => {
    if (!domainMin) {
      domainMin = datum.reading;
    }
    if (!domainMax) {
      domainMax = datum.reading;
    }
    if (!magnitude) {
      magnitude = getMagnitude(datum.reading);
    }
    if (datum.reading >= domainMax) {
      magnitude = magnitude >= getMagnitude(datum.reading) ? magnitude : getMagnitude(datum.reading)
      domainMax = datum.reading + magnitude;
    }
    if (datum.reading <= domainMin) {
      magnitude = magnitude >= getMagnitude(datum.reading) ? magnitude : getMagnitude(datum.reading)
      domainMin = datum.reading - magnitude;
    }
  });

  return (
    <VictoryChart
      style={{ parent: { maxWidth: '100%', maxHeight: '100%' } }}
      data-testid="trendline-graph"
      domain={{y: [domainMin, domainMax]}}
    >
      <svg style={{ height: 0 }}>
        <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 201, 162, 0.25)" stopOpacity="1" />
          <stop offset="100%" stopColor="rgba(255, 201, 162, 0)" stopOpacity="1" />
        </linearGradient>
        </defs>
      </svg>
      <VictoryAxis
        dependentAxis
        style={{
          axis: {
            stroke: "transparent"
          },
          grid: {
            fill: theme.colors.lightGrey3,
            stroke: theme.colors.lightGrey3,
            pointerEvents: "painted",
            strokeWidth: 1,
            strokeDasharray: '5,5'
          }
        }}
      />
      <VictoryAxis
        tickFormat={() => ''}
        style={{
          axis: {
            fill: theme.colors.lightGrey3,
            stroke: theme.colors.lightGrey3,
            strokeWidth: 1,
            strokeDasharray: '5,5'
          }
        }}
      />
      <VictoryArea
        style={{
          data: {
            stroke: theme.colors.indicators.warning,
            strokeWidth: 2,
            clipPath: `url(#clip-path-${kpi}-1)`,
            fill: "url(#grad1)"
          }
        }}
        data={graphData}
        x='date'
        y='reading'
        interpolation="natural"
      />
      <VictoryArea
        style={{
          data: {
            stroke: theme.colors.indicators.good,
            strokeWidth: 2,
            clipPath: `url(#clip-path-${kpi}-2)`,
            fill: "url(#grad1)"
          }
        }}
        data={graphData}
        x='date'
        y='reading'
        interpolation="natural"
      />
      <VictoryArea
        style={{
          data: {
            stroke: 'transparent',
            strokeWidth: 2,
            fill: "url(#grad1)"
          }
        }}
        data={graphData}
        x='date'
        y='reading'
        interpolation="natural"
      />
      <CustomClip threshold={threshold} kpi={kpi}/>
    </VictoryChart>
  )
};

TrendlineGraph.defaultProps = {
  kpi: '',
  graphData: [
    { reading: 100, date: '00:00\nNov 23' },
    { reading:  50, date: '01:00\nNov 23' },
    { reading:  20, date: '02:00\nNov 23' },
    { reading:  20, date: '03:00\nNov 23' },
    { reading: 150, date: '04:00\nNov 23' },
    { reading:  50, date: '05:00\nNov 23' },
    { reading:  20, date: '06:00\nNov 23' },
    { reading: 150, date: '07:00\nNov 23' },
    { reading: 150, date: '08:00\nNov 23' },
    { reading:  50, date: '09:00\nNov 23' },
    { reading:  20, date: '10:00\nNov 23' },
    { reading: 150, date: '11:00\nNov 23' }
  ],
  threshold: null,
  height: 500,
  width: 500,
  dependentAxisFormat: ''
};

export default TrendlineGraph;
