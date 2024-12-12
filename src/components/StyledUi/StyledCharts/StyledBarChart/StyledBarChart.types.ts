import { VictoryPieProps } from 'victory';
import { StyledChartsProps } from '../StyledCharts.types';

export type StyledBarChartPropsDataItem = Record<string, unknown>;

export type StyledBarChartPropsData = Record<string, unknown>[];

export interface StyledBarChartProps extends StyledChartsProps {
  data?: StyledBarChartPropsData;
  // is this a stacked bar chart over time?
  isOverTime?: boolean;
  categoryKey?: string;
}
