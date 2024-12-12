import { useMemo } from 'react';

export const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
    timestamp: '2023-08-11T08:55:07.355184+00:00'
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
    timestamp: '2023-08-12T08:55:07.355184+00:00'
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
    timestamp: '2023-08-13T08:55:07.355184+00:00'
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
    timestamp: '2023-08-14T08:55:07.355184+00:00'
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
    timestamp: '2023-08-15T08:55:07.355184+00:00'
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
    timestamp: '2023-08-16T08:55:07.355184+00:00'
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
    timestamp: '2023-08-17T08:55:07.355184+00:00'
  },
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
    timestamp: '2023-08-18T08:55:07.355184+00:00'
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
    timestamp: '2023-08-19T08:55:07.355184+00:00'
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
    timestamp: '2023-08-20T08:55:07.355184+00:00'
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
    timestamp: '2023-08-21T08:55:07.355184+00:00'
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
    timestamp: '2023-08-22T08:55:07.355184+00:00'
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
    timestamp: '2023-08-23T08:55:07.355184+00:00'
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
    timestamp: '2023-08-24T08:55:07.355184+00:00'
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
    timestamp: '2023-08-25T08:55:07.355184+00:00'
  }
];

interface ReturnProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

export const useLifeFeedData = (): ReturnProps => {
  // for demo use only
  const apiData = data;
  // do any data processing here, like filtering or anything here inside the cached hook.
  const processedData = useMemo(() => apiData, [apiData]);

  return { data: processedData };
};
