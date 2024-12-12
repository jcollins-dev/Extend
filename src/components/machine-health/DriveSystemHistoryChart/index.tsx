// 3rd party libs
import React from 'react';

// Components
import { StateOverTimeCard } from 'components';
import { DataRenderer } from 'components/machine-health';

// Theme
import theme from 'themes';

// Types
import { NestedRow } from 'components/StateOverTimeCard';
import { StatePeriod } from 'types/protein';

// Api
import { useGetDriveSystemStatesQuery } from 'api';

// Helpers
import { toISO8601 } from 'helpers';
import { useTimeZone } from 'providers';

type Props = {
  machineId: string;
  startDatetime: Date;
  endDatetime: Date;
};

// Format API response data to match the format StateOverTimeCard expects
const toNestedData = (states?: StatePeriod[]): NestedRow[] => {
  if (!states?.length) {
    return [];
  }

  return [
    {
      id: 0,
      label: 'Drive System',
      parentProperty: 'drive_system',
      data: states
    }
  ];
};

const DriveSystemHistoryChart = ({ machineId, startDatetime, endDatetime }: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { data, isFetching, error } = useGetDriveSystemStatesQuery({
    machineId,
    startDatetime: toISO8601(startDatetime, timeZone),
    endDatetime: toISO8601(endDatetime, timeZone)
  });

  // Map state codes to colors
  const colorMap = theme.colors.proteinMachineStateColors as { [key: string]: string };

  return (
    <DataRenderer isLoading={isFetching} error={error && 'Failed to load drive system data'}>
      <StateOverTimeCard
        title="Drive System History"
        nestedData={toNestedData(data)}
        stateColors={colorMap}
      />
    </DataRenderer>
  );
};

export default DriveSystemHistoryChart;
