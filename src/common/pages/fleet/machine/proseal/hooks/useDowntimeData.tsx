import React, { ReactNode, createContext, useContext, useMemo } from 'react';

export interface UseDowntimeDataProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

const DataContext = createContext<UseDowntimeDataProps>({
  isLoading: true
});

export const useDowntimeData = (): UseDowntimeDataProps => useContext(DataContext);

interface Props extends UseDowntimeDataProps {
  children?: ReactNode | ReactNode[];
}

export const UseDowntimeDataProvider = ({ children }: Props): JSX.Element => {
  // add api call here and then do processing

  // for demo mode
  const data = downtimeDemoData;

  // do any data processing here, like filtering or anything here inside the cached hook.
  const processedData = useMemo(() => downtimeDemoData.downtime_data, [data]);

  return <DataContext.Provider value={{ data: processedData }}>{children}</DataContext.Provider>;
};

// sample return from api
// please do not delete this
export const downtimeDemoData = {
  downtime_data: [
    {
      status: 'Stopped By Operator',
      total_time_seconds: 4171,
      count: 40,
      production_percentage: 40,
      category: 'Machine Stopped',
      color: '#FF1A1A'
    },
    {
      status: 'Break Detected',
      total_time_seconds: 3271,
      count: 30,
      production_percentage: 30,
      category: 'Machine Stopped',
      color: '#FF1A1A'
    },
    {
      status: 'Change Over',
      total_time_seconds: 3171,
      count: 17,
      production_percentage: 77,
      category: 'Machine Stopped',
      color: '#FF1A1A'
    },
    {
      status: 'Emergency Stop By Operator',
      total_time_seconds: 1777,
      count: 8,
      production_percentage: 8,
      category: 'Machine Error',
      color: '#E66C37'
    },
    {
      status: 'Tray Length Error',
      total_time_seconds: 1292,
      count: 8,
      production_percentage: 8,
      category: 'Machine Error',
      color: '#835DD0'
    },
    {
      status: 'Film Snap Error',
      total_time_seconds: 956,
      count: 7,
      production_percentage: 7,
      category: 'Machine Error',
      color: '#835DD0'
    },
    {
      status: 'Printer Error',
      total_time_seconds: 432,
      count: 1,
      production_percentage: 1,
      category: 'External Error',
      color: '#750985'
    }
  ]
};
