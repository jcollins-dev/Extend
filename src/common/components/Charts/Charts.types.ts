export interface ChartsPropsChartKeys {
  groupKey?: string;
  valueKey?: string;
  colorKey?: string;
}

export interface ChartsPropsStatus {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
}

export type ChartsPropsTotalBy = 'count' | 'total' | 'average';

export type ChartsPropsColors = Record<string, string>;

export type ChartsPropsType = 'pie' | 'doughnut';

export interface ChartsPropsFormat {
  /** formatting for the left side axis of the chart, returns string */
  axisX?: (props: string) => string;
  /** formatting for the bottom side axis of the chart, returns string */
  axisY?: (props: string) => string;
  /** formatting for the labels on the chart data, returns returns <Record<string, unknown>> */
  label?: (props: Record<string, unknown>) => string | string[];
  /** formatting for the chart legends that appear in the chart widget */
  legendItem?: (props: Record<string, unknown>) => string;
  /** formatting for the tooltips on the chart data, returns returns <Record<string, unknown>> */
  tooltip?: ({ datum }: { datum: Record<string, unknown> }) => string | string[];
}

export interface ChartsProps extends ChartsPropsChartKeys, ChartsPropsStatus {
  format?: ChartsPropsFormat;
  totalBy?: ChartsPropsTotalBy;
  type?: ChartsPropsType;
  colors?: ChartsPropsColors;
  // this is used for progress charts or charts that have one color
  color?: string;
}
