import React from 'react';
import { useFleetMachineAccountData } from '../../../hooks';
import { SkidUtilizationChart } from '../../components/SkidUtilizationChart/SkidUtilizationChart';
import { useSkidUtilizationKpi } from 'pages/FleetMachineDetail/hooks/useSkidUtilizationKpi';

const generateDateRangeAxis = (
  dateKey: string,
  data?: Record<string, unknown>[],
  props?: {
    // only show dates that are present in the retuned dateRanges array
    hasEntryOnly: boolean;
  }
): [string[] | undefined, string[] | undefined] => {
  if (!dateKey || !data || !data.length || !props) return [undefined, undefined];

  // generate an object with all the dates as keys to make sure
  // the same date isn't entered twice
  const dateKeys = data.reduce(
    (acc, item) => (acc = { ...acc, [item['day_machine_local_time'] as string]: true }),
    {}
  );
  // get the keys and sort them from low to high (start-finish)
  const dateEntries = Object.keys(dateKeys).sort();
  // send an array with [start, end] as strings
  const dateRange = [dateEntries[0], dateEntries[dateEntries.length - 1]];

  return [
    // [start, end]
    dateRange,
    // array of dates found, sorted from low to high
    dateEntries
  ];
};

export const SkidUtilizationCharts = (): JSX.Element => {
  // get the data from the api, this is the loading, message, error, etc states
  const apiCall = useSkidUtilizationKpi();
  // get what skids this machine has, from page provider
  const { hasSkids } = useFleetMachineAccountData();
  // set defaults to prevent crashing
  const skids = !hasSkids ? [1] : hasSkids;
  // redefine for type script
  const data = apiCall.data ? (apiCall.data as Record<string, unknown>[]) : undefined;
  // get the date ranges
  const [dateRange, dateRanges] = generateDateRangeAxis('day_machine_local_time', data, {
    hasEntryOnly: true
  });
  // get the number of ticks based on the date range
  const bottomTickCount = dateRanges ? dateRanges.length : undefined;
  return (
    <>
      {skids.map((skidNumber) => (
        <SkidUtilizationChart
          key={skidNumber}
          {...{ skidNumber, dateRange, dateRanges, bottomTickCount, ...apiCall }}
        />
      ))}
    </>
  );
};
