import { useMemo } from 'react';

interface ReturnProps {
  data?: Record<string, unknown>;
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

// this hook populates OEE widget on the Machine Health page
// it also populates the 3 OEE pie charts
export const useOEEData = (): ReturnProps => {
  // the api hook can go here
  const apiData = demoOEEData;

  // do any data processing here, like filtering or anything here inside the cached hook.
  const processedData = useMemo(() => apiData, [apiData]);

  //dont forget to set hasMessage if there is data, but no records
  return { data: processedData };
};

// sample return from api
// please do not delete this
// values should be displayed as percentages
const demoOEEData = {
  availability: 0.7,
  performance: 0.2,
  quality: null,
  oee: 0.95
};
