import { VictoryPieProps } from 'victory';
import { StyledChartsProps } from '../StyledCharts.types';

export type StyledPieChartPropsDataItem = Record<string, unknown>;

export type StyledPieChartPropsData = Record<string, unknown>[];

export interface StyledPieChartProps extends StyledChartsProps {
  data?: StyledPieChartPropsData;
}
