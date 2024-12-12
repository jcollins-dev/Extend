import { useMemo } from 'react';
import { useFilterSelected, filterSelectedData, DownloadCSVButtonProps } from 'components';
import { convertToChartData, convertToStackedChartData } from '../_helpers';
import { StyledChartsProps } from '../StyledCharts.types';

export interface UseStyledChartsPropsApiData {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
}

export interface UseStyledChartsProps {
  apiData?: UseStyledChartsPropsApiData;
  charts?: StyledChartsProps[];
  csvButtonSettings?: DownloadCSVButtonProps;
}

export interface UseStyledChartsProps {
  type: 'chart' | 'stackedChart';
  data?: Record<string, unknown>[];
  props?: Record<string, unknown>;
}

export const useStyledCharts = ({ data, ...props }: UseStyledChartsProps) => {
  if (!data) return undefined;
  /*
    let chartData: Record<string, unknown>[] | undefined = undefined;
    let stackedData: Record<string, Record<string, unknown>[]> | undefined = undefined;
  
    const { groupKey, categoryKey, ...converterProps } = props;
  
    if (!groupKey) {
      console.log('ERROR: useStyledCharts() missing `groupKey`');
      return undefined;
    }
  
    if (type === 'chart') {
      chartData = convertToChartData(data, groupKey as string, converterProps);
    }
  
    if (type === 'stackedChart') {
      if (!categoryKey) {
        console.log('ERROR: useStyledCharts() missing `categoryKey`');
        return undefined;
      }
  
      stackedData = convertToStackedChartData(
        data,
        groupKey as string,
        categoryKey as string,
        converterProps
      );
    }
  
    const [selected] = useFilterSelected();
    */

  const filteredData = useMemo(() => filterSelectedData({ data }), [data]);

  return filteredData;
};
