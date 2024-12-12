import { useMemo } from 'react';

interface ReturnProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

export const useOEEChartData = (): ReturnProps => {
  // for demo use only
  const chartApi = demoOEEChartData;

  // the api hook can go here

  // do any data processing here, like filtering or anything here inside the cached hook.
  const processedData = useMemo(() => chartApi['oee_data'], [chartApi]);

  return { data: processedData };
};

// sample return from api
// please do not delete this
// values should be displayed as percentages
// this the exact formatting of the return
const demoOEEChartData = {
  oee_data: [
    {
      timestamp: '2023-08-08T10:00:00+00:00',
      availability: 0.85,
      performance: 0.92,
      quality: null,
      oee: 0.782
    },
    {
      timestamp: '2023-08-08T11:00:00+00:00',
      availability: 0.89,
      performance: 0.91,
      quality: null,
      oee: 0.809
    },
    {
      timestamp: '2023-08-08T12:00:00+00:00',
      availability: 0.82,
      performance: 0.88,
      quality: null,
      oee: 0.7216
    },
    {
      timestamp: '2023-08-08T13:00:00+00:00',
      availability: 0.88,
      performance: 0.94,
      quality: null,
      oee: 0.8272
    }
  ]
};
