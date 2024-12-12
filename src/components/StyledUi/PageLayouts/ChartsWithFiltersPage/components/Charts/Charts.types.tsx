import { VictoryCommonThemeProps, TickProps } from 'victory-core';

import { FilterSelectedPropsSelected, UseContainerSizeReturnProps } from 'components';

export type ChartPropsData = Record<string, unknown>[];

export type StackedChartPropsData = Record<string, ChartPropsData>;

export type GlobalChartPropsColors = Record<string, string>;
export type GlobalChartPropsSelected = FilterSelectedPropsSelected;

export interface GlobalChartProps extends VictoryCommonThemeProps {
  rawData?: Record<string, unknown>[];
  dimensions?: UseContainerSizeReturnProps;
  colors?: GlobalChartPropsColors;
  handleClick?: (x?: Record<string, unknown>) => void;
  handleHover?: (x?: Record<string, unknown>) => void;
  checkIfSelected?: (x: Record<string, unknown>) => boolean;
  colorKey?: string;
  formatLabels?: (props: Record<string, unknown>) => string | string[];
  CustomTooltip?: (props: Record<string, unknown>) => JSX.Element;
  selected?: GlobalChartPropsSelected;
  formatCategoryAxisLabels?: (props: TickProps) => string;
  barRatio?: number;
}
