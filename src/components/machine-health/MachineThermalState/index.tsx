// 3rd party libs
import React from 'react';
import { useParams } from 'react-router-dom';

// Components
import { StateOverTimeCard } from 'components';

// Theme
import theme from 'themes';

// Types
import { NestedRow } from 'components/StateOverTimeCard';
import { ProteinMachineRouteQueryParams, ThermalState } from 'types/protein';

// Api
import { useGetMachineThermalStatesQuery } from 'api';

// Helpers
import DataRenderer from '../DataRenderer';

type Props = {
  startDatetime: string;
  endDatetime: string;
};

// Format API response data to match the format StateOverTimeCard expects
const toNestedData = (thermalStates?: ThermalState[]): NestedRow[] => {
  if (!thermalStates?.length) {
    return [];
  }

  return thermalStates
    ?.filter(({ states }) => states.length)
    .map((thermalState, idx) => ({
      id: idx,
      label: thermalState.label,
      parentProperty: thermalState.tagId,
      data: thermalState.states
    }));
};

const MachineThermalState = ({ startDatetime, endDatetime }: Props): JSX.Element => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { data, isFetching, error } = useGetMachineThermalStatesQuery({
    machineId,
    startDatetime,
    endDatetime
  });
  // Map cleaning state codes to colors
  const colorMap = theme.colors.proteinMachineStateColors as { [key: string]: string };

  return (
    <DataRenderer isLoading={isFetching} error={error && 'Failed to load machine thermal states'}>
      <StateOverTimeCard
        title="Thermal States"
        nestedData={toNestedData(data)}
        stateColors={colorMap}
      />
    </DataRenderer>
  );
};

export default MachineThermalState;
