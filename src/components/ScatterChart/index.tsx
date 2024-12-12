import React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import theme from 'themes';
import victoryTheme from 'themes/victory';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: { x: number | string | Date; y: number; label?: string }[];
  title?: string;
  height?: number;
  bubbleSize?: number;
}

const ScatterChart = ({ data, title, height, bubbleSize }: Props): JSX.Element => {
  return (
    <VictoryChart
      scale={{ x: 'time' }}
      theme={victoryTheme}
      domain={{ y: [0, 0] }}
      height={height ?? 50}
      containerComponent={<VictoryVoronoiContainer />}
    >
      <VictoryScatter
        labelComponent={
          <VictoryTooltip
            style={{ fill: theme.colors.white, fontSize: 5 }}
            flyoutPadding={8}
            text={(data) => `${data.datum?.label}`}
            flyoutWidth={70}
            flyoutHeight={10}
            cornerRadius={2}
            pointerLength={4}
            pointerWidth={8}
            flyoutStyle={{
              fill: theme.colors.black,
              fillOpacity: 0.8,
              pointerEvents: 'none',
              fontSize: 3
            }}
          />
        }
        labels={({ datum }) => datum.x}
        style={{
          data: {
            fill: theme.colors.asepticColors.lightRed,
            stroke: theme.colors.asepticColors.lightRed
          }
        }}
        size={bubbleSize ?? 3}
        data={data}
      />
      <VictoryLabel
        x={5}
        y={0}
        text={title}
        style={{
          fill: theme.colors.darkGrey,
          fontSize: 3,
          fontWeight: 'bold',
          fontFamily: theme.typography.family
        }}
      />
      <VictoryAxis
        tickFormat={() => ''}
        dependentAxis
        style={{
          grid: { stroke: '#f47e8d', strokeDasharray: '5', strokeWidth: 2 },
          axis: { stroke: 'transparent' },
          ticks: { stroke: 'transparent' },
          tickLabels: { fill: 'transparent' }
        }}
      />
      <VictoryAxis
        tickFormat={() => ''}
        style={{
          grid: { stroke: 'transparent', strokeDasharray: '5', strokeWidth: 2 },
          axis: { stroke: 'transparent' },
          ticks: { stroke: 'transparent' },
          tickLabels: { fill: 'transparent' }
        }}
      />
    </VictoryChart>
  );
};

export default ScatterChart;
