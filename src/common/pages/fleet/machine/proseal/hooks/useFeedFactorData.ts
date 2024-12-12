import { useMemo } from 'react';

interface ReturnProps {
  data?: Record<string, unknown>;
  average?: number;
  chartData?: Record<string, unknown>[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

const demoColors: Record<string, string> = {
  overfed: '#118DFF',
  well_fed: '#009EB3',
  underfed: '#FFB800',
  very_underfed: '#E66C37'
};

// this hook populates FeedFactor widget on the Machine Health page
// it also populates the 3 FeedFactor pie charts
export const useFeedFactorData = (): ReturnProps => {
  // the api hook can go here
  const apiData = demoFeedFactorData;

  // do any data processing here, like filtering or anything here inside the cached hook.
  const { average, chartData } = useMemo(() => {
    if (apiData) {
      const { average, ...chartItems } = apiData || {};
      const chartData = Object.entries(chartItems).map(([key, value]) => ({
        group: key,
        count: value,
        color: demoColors?.[key] as string
      }));
      return { average, chartData };
    }
    return {};
  }, [apiData]);

  // need to add isLoading api status
  //dont forget to set hasMessage if there is data, but no records
  return { average, chartData };
};

// sample return from api
// please do not delete this
// values should be displayed as percentages
const demoFeedFactorData = {
  average: 0.755,
  overfed: 0.8,
  well_fed: 76,
  underfed: 13.6,
  very_underfed: 0.8
};
