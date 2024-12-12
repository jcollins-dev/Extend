/*
 * Query machine data
 */

import { useGetMachineHealthByBuKpiQuery } from 'api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { MachineHealthKpiItem } from 'types/machine-health';
import { BusinessUnit } from 'types/dsi';

type Response = {
  machineHealth: MachineHealthKpiItem[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

const useMachineHealthByBuKpi = (
  machineId: string,
  machineKpiType: string,
  kpiDataInterval: string,
  includeHistoricData: boolean,
  businessUnit: BusinessUnit,
  psuName?: string,
  pollingInterval?: number
): Response => {
  let totalValuesDesired = undefined;
  totalValuesDesired = 1000;

  const {
    data: machineHealth,
    error,
    isLoading,
    isFetching
  } = useGetMachineHealthByBuKpiQuery(
    {
      machineId,
      kpiDataInterval,
      widgetType: machineKpiType,
      limit: 100000,
      includeHistoricData,
      businessUnit,
      psuName,
      totalValuesDesired
    },
    {
      pollingInterval: pollingInterval ?? 30000
    }
  );

  return { machineHealth, isLoading, isFetching, error };
};

export default useMachineHealthByBuKpi;
