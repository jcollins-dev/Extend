/*
 * Query machine data
 */

import { useGetAsepticMachineHealthKpiQuery } from 'api';
import { useParams } from 'react-router-dom';
import { AsepticMachineHealthKpiItem } from 'types/machine-health';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

type Response = {
  machineHealth: AsepticMachineHealthKpiItem[] | undefined;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

const useMachineHealthKpi = (
  widgetType: string,
  kpiDataInterval: string,
  includeHistoricData: boolean
): Response => {
  const { machineId } = useParams<{ machineId: string }>();
  const {
    data: machineHealth,
    error,
    isLoading
  } = useGetAsepticMachineHealthKpiQuery(
    {
      machineId,
      kpiDataInterval: kpiDataInterval,
      widgetType: widgetType,
      limit: 100000,
      includeHistoricData
    },
    {
      pollingInterval: 30000
    }
  );
  return { machineHealth, isLoading, error };
};

export default useMachineHealthKpi;
