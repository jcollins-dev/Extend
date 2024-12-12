/*
 * Query machine data
 */

import { useGetMachineHealthByProductTypeKpiQuery } from 'api';
import { useParams } from 'react-router-dom';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { MachineHealthKpiItem } from 'types/machine-health';

type Response = {
  machineHealth: MachineHealthKpiItem[] | undefined;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

const useMachineHealthByProductTypeKpi = (
  businessUnit: string,
  productType: string,
  startDatetime: string,
  endDatetime: string
): Response => {
  const { machineId } = useParams<{ machineId: string }>();
  const {
    data: machineHealth,
    error,
    isLoading
  } = useGetMachineHealthByProductTypeKpiQuery(
    {
      machineId,
      businessUnit,
      productType,
      startDatetime,
      endDatetime
    },
    {
      pollingInterval: 30000
    }
  );
  return { machineHealth, isLoading, error };
};

export default useMachineHealthByProductTypeKpi;
