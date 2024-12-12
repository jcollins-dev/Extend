/*
 * Query machine data
 */

import { useGetMachineStatesCategoriesQuery } from 'api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export interface MachineStatuses {
  timestamp?: string;
  value?: number;
  name?: string;
  end_timestamp?: string;
  status?: string;
  unit?: null;
  target?: null;
  app_name?: null;
  psu_name?: null;
}

type Response = {
  states: MachineStatuses[] | undefined;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

const useMachineStateProtein = (
  machineId: string,
  localStartDatetimeString: string,
  pollingInterval?: number
): Response => {
  //TODO timestamp
  const {
    data: states,
    isLoading,
    error
  } = useGetMachineStatesCategoriesQuery({
    machineId,
    startDatetime: '2023-07-02T23:59:59+02:00',
    pollingInterval
  });

  return { states, isLoading, error };
};

export default useMachineStateProtein;
