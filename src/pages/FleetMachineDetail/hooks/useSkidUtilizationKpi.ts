import { useApiData, UseApiDataReturnProps } from 'sandbox/joey/useApiCall';
import { useFleetMachineAccountData } from './useFleetMachineAcountData';
import { useDateRange } from 'components';

export type UseSkidUtilizationKpiReturnProps = UseApiDataReturnProps;

export const useSkidUtilizationKpi = (): UseApiDataReturnProps => {
  const { machineId } = useFleetMachineAccountData();
  const start = useDateRange().isoDateRange.startTime.split('T')[0];

  const apiCall = useApiData(
    `/mh/v1/avure/machine-health/${machineId}/skid-utilization-kpi?start_datetime=${start} 00%3A00%3A00`
  );

  return apiCall;
};
