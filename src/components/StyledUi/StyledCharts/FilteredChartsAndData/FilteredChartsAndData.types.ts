import { StyledChartsProps } from '../StyledCharts.types';
import { DownloadCSVButtonProps } from 'components';
import { VirtualizedTableProps } from '../VirtualizedTable';

export interface FilteredChartsAndDataPropsApiData {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
}

export interface FilteredChartsAndDataProps {
  apiData?: FilteredChartsAndDataPropsApiData;
  data?: Record<string, unknown>[];
  charts?: StyledChartsProps[];
  tables?: VirtualizedTableProps[];
  csvButtonSettings?: DownloadCSVButtonProps;
}
