import { useMemo } from 'react';

interface ReturnProps {
  data?: Record<string, unknown>;
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

export const useMachineOverviewData = (): ReturnProps => {
  // for demo use only
  const apiData = demoData;

  // the api hook can go here

  // do any data processing here, like filtering or anything here inside the cached hook.
  const processedData = useMemo(() => apiData, [apiData]);

  return { data: processedData };
};

// sample return from api
// please do not delete this
const demoData = {
  status: 'machine running',
  job_number: 548,
  recipe: 'Raspberry Portugal',
  todays_pack_count: 85600,
  tooling_set_maintenance: 75,
  cycles_until_next_maintenance: 40000
};
