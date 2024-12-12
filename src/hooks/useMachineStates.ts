import { useGetMachineStatesByBuQuery } from 'api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { BusinessUnit, MachineStateCodes, MachineStateNames } from 'types/dsi';
import { StatePeriod } from 'types/protein';
type Response = {
  result: StatePeriod[] | undefined;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

const useMachineStates = (
  machineId: string,
  businessUnit: BusinessUnit,
  startTimestamp?: string,
  endTimestamp?: string
): Response => {
  const {
    data: machineStates,
    isLoading,
    error
  } = useGetMachineStatesByBuQuery(
    {
      machineId,
      businessUnit,
      startTimestamp,
      endTimestamp
    },
    {
      pollingInterval: 30000
    }
  );

  const result: StatePeriod[] = [];
  const stateMapping: Record<string, string> = {
    [MachineStateNames.Offline]: MachineStateCodes.Offline,
    [MachineStateNames.NoProduct]: MachineStateCodes.NoProduct,
    [MachineStateNames.Running]: MachineStateCodes.Running,
    [MachineStateNames.NotRunning]: MachineStateCodes.NotRunning
  };

  machineStates?.forEach((machineState, index) => {
    const item = {
      ...machineState
    };
    // Make first item Offline with 0 duration so the legend for Offline shows up in chart as usually we don't have offline status.
    if (index === 0) {
      item.stateCode = MachineStateCodes.Offline;
      item.stateName = MachineStateNames.Offline;
      item.endTimestamp = machineState.startTimestamp;
    }
    if (machineState.stateCode === 0) {
      const stateName = item.stateName;
      item.stateCode = stateMapping[stateName] ?? '0';
      result.push(item);
    } else {
      item.stateCode = JSON.stringify(machineState.stateCode);
      result.push(item);
    }
  });
  return { result, isLoading, error };
};

export default useMachineStates;
