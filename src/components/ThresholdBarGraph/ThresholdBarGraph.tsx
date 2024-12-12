import React, { ReactElement } from 'react';
import { DependentAxisFormat, ReadingBarData, ThresholdBarGraphProps } from 'types';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter
} from 'victory';

import { default as theme } from 'themes';

const getDependantAxisFormat = (value: number, format?: DependentAxisFormat): string => {
  let formattedValue = '';
  switch(format) {
    case DependentAxisFormat.PERCENTAGE: formattedValue = `${value}%`;
      break;
    case DependentAxisFormat.TIME: formattedValue = `${value}:00`;
      break;
    default: formattedValue = `${value}`;
      break;
  }
  return formattedValue;
}

// function to fill in threshold data for all time values (creating a constant line)
function thresholdToLineData(threshold: number, barData: Array<ReadingBarData>) {
  return barData.map((datum) => {
    return { x: datum.date, y: threshold };
  });
}

// by default, coming in below the threshold is considered good.
// ie: machine heat exceeding threshold = bad
function getReadingColor(reading: number, threshold: number, goodAboveThreshold = false) {
  if (goodAboveThreshold) {
    return reading > threshold ? theme.colors.indicators.good : theme.colors.indicators.bad;
  }
  return reading < threshold ? theme.colors.indicators.good : theme.colors.indicators.bad;
}

const ThresholdBarGraph = ({
  barData,
  threshold,
  goodAboveThreshold,
  dependentAxisFormat
}: ThresholdBarGraphProps): ReactElement => {
  return (
    <VictoryChart
      style={{ parent: { maxWidth: '100%', maxHeight: '100%' } }}
      data-testid="threshold-bar-graph"
      domainPadding={{ x: [0, 15] }}
    >
      <VictoryAxis
        tickLabelComponent={<VictoryLabel dx={5}/>}
        fixLabelOverlap={true}
        style={{
          axis: {
            stroke: theme.colors.lightGrey3
          },
          tickLabels: {
            fontSize: 11
          }
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={x => getDependantAxisFormat(x, dependentAxisFormat)}
        style={{
          axis: {
            stroke: "transparent"
          },
          grid: {
            fill: theme.colors.lightGrey3,
            stroke: theme.colors.lightGrey3,
            pointerEvents: "painted",
            strokeWidth: 1
          }
        }}
      />
        <VictoryLine
          data={thresholdToLineData(threshold, barData)}
          // creates dashed styling on threshold line
          style={{
            data: {
              stroke: theme.colors.darkGrey,
              strokeDasharray: '5,5'
            }
          }}
        />
        <VictoryBar
          data={barData}
          alignment="start"
          x="date"
          y="reading"
          style={{
            data: {
              fill: ({ datum }) => getReadingColor(datum.reading, threshold, goodAboveThreshold)
            }
          }}
          barRatio={0.9}
        />
        { threshold &&
          <VictoryScatter
            data={[{ x: barData.length, y: threshold }]}
            labels={() => ["Target", `(${getDependantAxisFormat(threshold, dependentAxisFormat)})`]}
            labelComponent={
              <VictoryLabel
                dx={20}
                dy={7}
                textAnchor="start"
                verticalAnchor="middle"
              />
            }
          />
        }
    </VictoryChart>
  );
};

ThresholdBarGraph.defaultProps = {
  barData: [
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

export default ThresholdBarGraph;
