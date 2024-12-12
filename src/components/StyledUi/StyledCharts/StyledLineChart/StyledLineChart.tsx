import React from 'react';

import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import {
  defaultFlyoutStyles,
  defaultLabelStyles,
  defaultTickLabelsStyles
} from '../StyledCharts.styles';
import { formatLocaleDate } from 'components/StyledUi/js';
interface LineChartProps {
  data?: Record<string, unknown>[];
  /* remove this for later, it's to add the UOM but should be here, using as a quick fix */
  unit?: string;
  charts?: {
    xKey: string;
    yKey: string;
    color?: string;
    label?: string;
    unit?: string;
  }[];
  selectedChart?: string[];
}

export const StyledLineChart = ({
  data,
  charts,
  selectedChart,
  unit
}: LineChartProps): JSX.Element => {
  if (!data) return <></>;

  return (
    <VictoryChart
      width={1200}
      height={250}
      scale={{ x: 'time' }}
      padding={{ top: 10, bottom: 50, left: 50, right: 50 }}
      domainPadding={{ y: 30 }}
      containerComponent={
        <VictoryVoronoiContainer />
        //zoomDimension="x"
        //zoomDomain={{ x: [0, 6], y: [0, 10] }}
      }
    >
      {charts?.map(({ xKey, yKey, color, label }, index) => {
        return (
          <VictoryLine
            key={`linechart${index} `}
            labels={
              !charts
                ? undefined
                : (d) => {
                    const datum = d.datum as Record<string, unknown>;
                    const date = formatLocaleDate(datum[xKey] as string, 'short');
                    return [
                      `${date}`,
                      ` \n `,
                      `${label}: ${Math.round(Number(datum[yKey]))}${
                        unit === '%' ? `` : ` `
                      }${unit}`
                    ];
                  }
            }
            labelComponent={
              <VictoryTooltip
                renderInPortal
                dy={-3}
                flyoutPadding={{ left: 10, right: 10, top: 10, bottom: 5 }}
                flyoutStyle={defaultFlyoutStyles}
                style={[
                  defaultLabelStyles,
                  { fontSize: 5 },
                  { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
                ]}
              />
            }
            data={data}
            interpolation="monotoneX"
            y={yKey}
            x={xKey}
            style={{
              data: {
                opacity: !selectedChart ? 1 : selectedChart?.includes(label || '') ? 1 : 0,
                stroke: color || 'blue',
                strokeWidth: 1.5,
                cursor: 'pointer'
              }
            }}
          />
        );
      })}
      <VictoryAxis
        dependentAxis
        style={{
          // style bottom line
          axis: {
            stroke: 'rgba(0,0,0,.4)'
          },
          // style bottom labels
          tickLabels: defaultTickLabelsStyles,
          // style horizontal lines
          grid: {
            stroke: 'rgba(0,0,0,.2)'
          }
        }}
      />
      <VictoryAxis
        fixLabelOverlap
        style={{
          // style bottom line
          axis: {
            stroke: 'rgba(0,0,0,.4)'
          },
          // style bottom labels
          tickLabels: defaultTickLabelsStyles,
          grid: {
            stroke: 'rgba(0,0,0,.2)',
            strokeDasharray: '2, 4',
            strokeWidth: 1
          }
        }}
        tickCount={6}
        tickFormat={(datum: string) => {
          const [date, timetz] = datum.split('T');
          const [time] = timetz.split('+' || '-');
          return `${date}\n${time} `;
        }}
      />
    </VictoryChart>
  );
};
