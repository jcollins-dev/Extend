import { useEffect, useState } from 'react';
import store from 'store';

export interface UseApiDataReturnProps {
  isLoading?: boolean;
  hasError?: string;
  error?: Record<string, unknown>;
  hasMessage?: string;
  data?: Record<string, unknown>[];
}

const defaults = {
  isLoading: true,
  hasMessage: undefined,
  hasError: undefined,
  data: undefined,
  error: undefined
};
// demo paths
// /api/mh/v1/dsi-machine-alarms/${machineId}?start_datetime=${isoDateRange?.startTime}&end_datetime=${isoDateRange?.endTime}
// /api/mh/v1/dsi-machine-alarms/86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c?start_datetime=2023-09-27T14%3A00%3A18-05%3A00&end_datetime=2023-10-11T14%3A00%3A18-05%3A00&log_type=ALARM
export const useApiData = (path: string, type?: string): UseApiDataReturnProps => {
  // the return of this hook, will be set inside the useEffect hook
  const [apiResponse, setApiResponse] = useState<Record<string, unknown>>(defaults);
  // check if api has been added to base path
  if (path.split('/')[0] !== 'api') path = `/api${path}`;
  // get the store for redux to get the auth token
  const currentState = store.getState();
  // get the auth token
  const token = currentState?.tokens?.token;
  // Define custom headers for the fetch call
  const headers = {
    Authorization: `Bearer ${token}`, // Example authorization header
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9'
  };
  // make the call
  useEffect(() => {
    if (token)
      fetch(path, {
        method: type || 'GET',
        headers: headers
      })
        .then((response) => response.json())
        .then((data) => setApiResponse({ data }))
        .catch((error) => setApiResponse({ error }));
  }, [token, path]);

  return apiResponse;
};
