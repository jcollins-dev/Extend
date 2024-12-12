import React from 'react';
import { StyledChartsProps } from '../StyledCharts.types';
import { WidgetUiProps } from 'components/StyledUi/WidgetUi';
import { PieChartUi } from '../PieCharts/PieChartUi';
import { BarChartUi } from '../BarCharts/BarChartUi';
import { StyledChartLegendProps } from '../ChartLegends';
import { DateRangeProps } from 'components';
import { TotalsBarProps } from '../UIChartsAndFiltersPage/TotalsBar';

export interface UseStyledChartProps extends StyledChartsProps {
  widgetSettings?: WidgetUiProps;
  title?: string;
  hasLegend?: boolean;
  data?: Record<string, unknown>[];
  stackedData?: Record<string, Record<string, unknown>[]>;
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  legendSettings?: StyledChartLegendProps;
  dateRange?: DateRangeProps;
  hideLegend?: boolean;
  i?: number;
  /** is this chart filtered based on keys?  this is linked to the FilterSelected hook/provider */
  filteredByKeys?: string[];
  usesFilteredData?: boolean;
}

export interface UseStyledChartsProps extends StyledChartsProps {
  stackedData?: Record<string, Record<string, unknown>[]>;
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  charts?: UseStyledChartProps[];
  dateRange?: DateRangeProps;
  totalsBarSettings?: TotalsBarProps;
  usesFilteredData?: boolean;
}

export const useStyledChart = (props: UseStyledChartProps): JSX.Element => {
  switch (props.type) {
    case 'pie':
      return <PieChartUi key={props?.i || `chart${props.title}`} {...props} />;
    case 'stacked-bar-over-time':
    case 'bar-over-time':
    case 'stacked-bar':
      //case 'bar':
      return <BarChartUi key={props?.i || `chart${props.title}`} {...props} />;

    default:
      return <>`{props.type}` chart not available in this version</>;
  }
};

export const useStyledCharts = ({ charts, ...rest }: UseStyledChartsProps): JSX.Element => {
  if (!charts) return <>error: missing `charts` variable</>;
  return <>{charts.map((props, i) => useStyledChart({ i, ...props, ...rest }))}</>;
};
