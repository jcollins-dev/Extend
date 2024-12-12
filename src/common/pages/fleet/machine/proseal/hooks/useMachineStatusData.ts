import { useMemo } from 'react';

interface ReturnProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

export const useMachineStatusData = (): ReturnProps => {
  // for demo use only
  const apiData = demoData;

  // the api hook can go here

  // do any data processing here, like filtering or anything here inside the cached hook.
  const processedData = useMemo(() => apiData['live_data'], [apiData]);

  return { data: processedData };
};

// sample return from api
// please do not delete this
const demoData = {
  live_data: [
    {
      timestamp: '2023-08-08T12:00:00+00:00',
      status: 'Machine Running',
      status_category: 'Machine Running',
      color: '#008000',
      ppm: 20,
      ideal_ppm: 40
    },
    {
      timestamp: '2023-08-08T12:00:00+00:00',
      status: 'Machine Running',
      status_category: 'Machine Running',
      color: '#008000',
      ppm: 20,
      ideal_ppm: 40
    }
  ]
};
