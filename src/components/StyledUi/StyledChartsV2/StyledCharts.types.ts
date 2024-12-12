import { VictoryStyleObject, InterpolationPropType } from 'victory-core';
import { StyledChartLegendProps } from './ChartLegends';

/** A single data item entry for the data of a chart
 * we keep this typed as generic to make charts easily compatible with
 * any data structure
 */
export type StyledChartsPropsDataItem = Record<string, unknown>;

export interface StyledChartsPropsStyles {
  /** color of the line, or border of bar or slice */
  stroke?: string;
  /** color of the curve below the line or color of bar or slice */
  fill?: string;
}

export interface StyledChartsPropsChartKeys extends StyledChartsPropsStyles {
  /** this won't be used much. the key to use as x values, this should be a numeric value, */
  xKey?: string;
  /** this won't be used much. the key to use as y values, this is how the items are displayed in line, used on bar charts and line charts */
  yKey?: string;
  /** the key to use as x values, this should be a numeric value */
  groupKey?: string;
  /** the key to use as y values, this is how the items are displayed in line, used on bar charts and line charts */
  categoryKey?: string;
  /** if using custom colors, you can use the colorKey as the key to use in the data item, to get that value as an ID that
   * that matches the key in the colors object.  By default, the charts use the groupKey as the default colorKey */
  colorKey?: string;
  /** key used to group the stacked data by date, this is for stacked charts over time */
  dateKey?: string;
  /** value key is used for line charts these must be set in order for line charts to work */
  valueKey?: string;
}

export interface StyledChartsPropsFormat {
  /** formatting for the left side axis of the chart, returns string */
  axisX?: (props: string) => string;
  /** formatting for the bottom side axis of the chart, returns string */
  axisY?: (props: string) => string;
  /** formatting for the labels on the chart data, returns returns <Record<string, unknown>> */
  label?: (props: StyledChartsPropsDataItem) => string | string[];
  /** formatting for the chart legends that appear in the chart widget */
  legendItem?: (props: StyledChartsPropsDataItem) => string;
  /** formatting for the tooltips on the chart data, returns returns <Record<string, unknown>> */
  tooltip?: (props: StyledChartsPropsDataItem) => string | string[];
}

export interface StyledChartsPropsHandle {
  click?: (props: StyledChartsPropsDataItem) => void;
  mouseEnter?: (props: StyledChartsPropsDataItem) => void;
  mouseLeave?: (props: StyledChartsPropsDataItem) => void;
}

export interface StyledChartsPropsVictoryStyles {
  data?: VictoryStyleObject;
  labels?: VictoryStyleObject;
  tooltips?: VictoryStyleObject | VictoryStyleObject[];
  axisX?: VictoryStyleObject;
  axisY?: VictoryStyleObject;
}

export type StyledChartsTypesProps =
  //'bar'
  //| 'line'
  'line-over-time' | 'pie' | 'stacked-bar' | 'bar-over-time' | 'stacked-bar-over-time' | 'bar';

export interface StyledChartsProps extends StyledChartsPropsChartKeys, StyledChartsPropsStyles {
  /** colors to use for this chart, the key will typically be the value of 'groupKey' (found in type StyledChartsPropsChartKeys)
   * or a custom 'colorKey' can be passed, and charts will use the value data item's key (datum return)  or it will use groupKey by default */
  colors?: Record<string, unknown>;
  /** click and even handlers for slices, bars, points, etc. */
  handle?: StyledChartsPropsHandle;
  /** formatting of tooltip, labels, axis etc. */
  format?: StyledChartsPropsFormat;
  /** use for line charts.  Changes the curve or style of line */
  interpolation?: InterpolationPropType;
  /** show or hide the axis labels, default for pie is off, line and bar charts is on */
  /** if axisView is set to 'hide', tooltips are disabled due to the nature of ther charts */
  axisView?: 'show' | 'hide';
  /** show or hide the grid lines, only available for line or bar style charts with axis views */
  gridLinesView?: 'show' | 'hide';
  /** victory chart stylers, this is fully customized charts */
  styles?: StyledChartsPropsVictoryStyles;
  /** hide the tooltips, the default is on */
  hideTooltips?: boolean;
  /** tooltip styles */
  tooltipStyles?: VictoryStyleObject | VictoryStyleObject[];
  /** label styles */
  labelStyles?: VictoryStyleObject | VictoryStyleObject[];
  /** label used for chart (seein in tooltips and labels) */
  label?: string;
  /** function to check if slice is selected */
  checkIfSelected?: (props: StyledChartsPropsDataItem) => boolean;
  /** type of chart this is, in string format, used in hook, but also to pick if a pie chart is a pie or doughnut */
  type?: StyledChartsTypesProps | string;
  /** do not use the currently selected date range, instead use the first date and last in the api return
   * this is for generating the bottom axis of a bar chart over time.  Set this to true if you don't want empty
   * chart columns if there was no date for those days */
  useDataReturnDateRange?: boolean;
  /** use for line charts to draw a line for each key value in the data*/
  chartKeys?: StyledChartsPropsChartKeys[];
}
