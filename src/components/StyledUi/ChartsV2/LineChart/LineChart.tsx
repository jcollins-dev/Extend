import React from 'react';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryZoomContainer
} from 'victory';
import { ChartSettingsProps, LineChartDataItemProps } from '../Charts.types';
import moment from 'moment';

export interface LineChartPropsv1 extends ChartSettingsProps {
  /** incoming aray of data objects in the form of [{x: label, y: value}] */
  data?: LineChartDataItemProps[];
  /** click handers for pie slicers, returns the X: label value of the pie slice. */
  handleClick?: (x: string | number) => void;
  /** array of labels that are selected, can be sent from the filters array from useFilterStates, it's used for styling */
  selected?: string[];
  colors?: {
    [key: string]: string;
  };
  maxDomain?: number;
  categories?: string[];
}

export interface LineChartProps extends ChartSettingsProps {
  /** incoming aray of data objects in the form of [{x: label, y: value}] */
  data?: LineChartDataItemProps[];
  canZoom?: boolean;
  axisLeftLabel?: string;
  axisLeftTickLabel?: string;
}

const Bottom = (
  <VictoryAxis
    tickLabelComponent={
      <VictoryLabel
        text={({ datum }: { datum?: Date }) => {
          const nd = moment(datum);
          const label = nd.format('l');
          const time = nd.format('h:mm a');
          return `${time}\n${label}`;
        }}
      />
    }
    style={{
      // style bottom line
      axis: {
        stroke: 'rgba(0,0,0,.3)'
      },
      // style bottom labels
      tickLabels: {
        fontSize: 12,
        padding: 3,
        fill: 'grey',
        fontFamily: `inherit`
      },
      // style horizontal lines
      grid: {
        stroke: 'rgba(0,0,0,.2)',
        strokeDasharray: '2',
        strokeWidth: 1
      }
    }}
  />
);

export const LineChart = ({
  data,
  canZoom,
  width,
  height,
  axisLeftTickLabel,
  axisLeftLabel
}: LineChartProps): React.ReactElement => {
  const Left = (
    <VictoryAxis
      dependentAxis
      label={axisLeftLabel || ''}
      tickCount={5}
      tickLabelComponent={
        <VictoryLabel
          text={({ datum }: { datum?: number }) =>
            axisLeftTickLabel ? `${datum}\n${axisLeftTickLabel}` : `${datum}`
          }
        />
      }
      style={{
        // style left line
        axis: {
          stroke: 'rgba(0,0,0,.3)'
        },
        // style left labels
        tickLabels: {
          fontSize: 12,
          padding: 3,
          fill: 'grey',
          fontFamily: `inherit`
        },
        // style verticle lines
        grid: {
          stroke: 'rgba(0,0,0,.1)'
        },
        axisLabel: {
          fill: 'grey',
          angle: 0,
          fontFamily: `inherit`,
          direction: 'text',
          writingMode: 'text'
        }
      }}
    />
  );

  if (!data) return <></>;

  return (
    <VictoryChart
      {...{ width, height }}
      scale={{ x: 'time' }}
      containerComponent={canZoom ? <VictoryZoomContainer zoomDimension="x" /> : undefined}
    >
      <VictoryLine data={data} style={{ data: { stroke: '#0088cc' } }} />
      {Left}
      {Bottom}
    </VictoryChart>
  );
};
