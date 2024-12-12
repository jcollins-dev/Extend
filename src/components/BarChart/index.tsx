// 3rd party
import React from 'react';
import {
  VictoryAxis,
  VictoryAxisProps,
  VictoryBar,
  VictoryBarProps,
  VictoryChart,
  VictoryThemeDefinition
} from 'victory';

import { merge } from 'lodash';
import theme from 'themes';

type PaddingType = number | [number, number];
type DomainPaddingPropType =
  | PaddingType
  | {
      x?: PaddingType;
      y?: PaddingType;
    };

type Bar = { x: string | number; y: number; color?: string };

type BarChartPadding = {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
};

type Dims = {
  width?: number;
  height?: number;
};

type BarchartConfig = {
  bar?: VictoryBarProps;
  xAxis?: VictoryAxisProps;
  yAxis?: VictoryAxisProps;
};

interface BarChartProps {
  // The bars, in the specified order
  bars: Bar[];
  // Chart dimensions, in pixel units
  dims?: Dims;
  // Chart configuration
  config?: BarchartConfig;
  // VictoryTheme
  theme?: VictoryThemeDefinition;
  // tick formatter
  format?: (tick: number) => string;
  domainPadding: DomainPaddingPropType;
  padding?: BarChartPadding;
}

// Default set of props
const defaultConfig: BarchartConfig = {
  bar: {
    barRatio: 1,
    style: {
      data: { fill: ({ datum }) => datum.color }
    }
  },
  yAxis: {
    dependentAxis: true,
    offsetX: 50,
    style: {
      tickLabels: { fill: theme.colors.mediumGrey2 },
      axis: {
        stroke: 'transparent'
      },
      grid: { stroke: theme.colors.lightGrey3, strokeWidth: 1 }
    }
  },
  xAxis: {
    style: {
      tickLabels: { padding: 10 },
      axis: {
        stroke: theme.colors.lightGrey3,
        strokeWidth: 1
      }
    }
  }
};

const defaultPadding = {
  top: 30,
  bottom: 30,
  right: 60,
  left: 60
};

const BarChart = ({
  bars,
  dims,
  config,
  padding,
  theme,
  domainPadding,
  format
}: BarChartProps): JSX.Element => {
  const categories = bars.map((bar) => bar.x) as string[];
  const { bar, xAxis, yAxis } = merge({}, defaultConfig, config) as BarchartConfig;
  const p = merge({}, defaultPadding, padding);
  /**
   * 
   * Victory render is order dependent
     <VictoryBar />  will end up on top
   */
  return (
    <VictoryChart
      domainPadding={domainPadding}
      theme={theme}
      width={dims?.width}
      height={dims?.height}
      padding={p}
    >
      <VictoryAxis {...yAxis} tickFormat={(tick) => (format ? format(tick) : tick)} />
      <VictoryAxis {...xAxis} />
      <VictoryBar categories={{ x: categories }} data={bars} {...bar} />
    </VictoryChart>
  );
};

export default BarChart;
