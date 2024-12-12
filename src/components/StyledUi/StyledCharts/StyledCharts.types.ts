import { WidgetUiProps } from '../WidgetUi';
import { ColorScalePropType } from 'victory-core';

export type StyledChartsPropsDataItem = Record<string, unknown>;
export type StyledChartsPropsGroupKey = string;
export type StyledChartsPropsCategoryKey = string;

export interface StyledChartsPropsFormat {
  label?: (props?: StyledChartsPropsDataItem) => string | string[];
  axisX?: (props: string) => string;
  axisY?: (props: string) => string;
  tooltip?: (props?: StyledChartsPropsDataItem) => string | string[];
  legendItem?: (props?: StyledChartsPropsDataItem) => string;
}

export interface StyledChartsPropsHandle {
  click?: (props?: StyledChartsPropsDataItem) => void;
  mouseEnter?: (props?: StyledChartsPropsDataItem) => void;
  mouseLeave?: (props?: StyledChartsPropsDataItem) => void;
}

export interface StyledChartsProps {
  // processed data from api call, this will passed down to the charts
  // and the charts will format that data to be used in the charts
  apiData?: {
    data?: Record<string, unknown>[];
    isLoading?: boolean;
    hasMessage?: string;
    hasError?: string;
  };
  // setsColors for other charts to use the useColors hooks
  setsColors?: boolean;
  // set if the chart is filtered
  filteredByKeys?: string[];
  // obj key to group the api data by (to generate bars and slices)
  groupKey?: string;
  categoryKey?: string;
  // width of the chart
  width?: number;
  // height of the chart
  height?: number;
  // gets the chart data and returns true or false if selected based on incoming function
  checkIfSelected?: (props?: StyledChartsPropsDataItem) => boolean;
  // set this value based on victory color scale props
  colorScale?: ColorScalePropType;
  // custom colors for chart
  colors?: Record<string, string>;
  // handlers
  handle?: StyledChartsPropsHandle;
  // formatters for chart labels and axis labels
  format?: StyledChartsPropsFormat;
  // this is needed to pass a TS check for a diefferent component, it's not used in this component
  type?: string;
  autoLegend?: boolean;
  widgetUiSettings?: WidgetUiProps;
}
