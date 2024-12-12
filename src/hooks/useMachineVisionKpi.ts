// 3rd Party Libraries
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';

// API
import { useGetMachineVisionKpiQuery } from 'api';

// Types
import { MachineVisionInterval, MachineVisionKpiItem } from 'types/machine-vision';

type Response = {
  result: MachineVisionKpiItem | undefined;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

/*
 * Query machine data
 */

const useMachineVisionKpi = (
  machineVisionKpiType: string,
  includeHistoricData: boolean,
  kpiDataInterval: MachineVisionInterval = MachineVisionInterval.Last8Hours
): Response => {
  const { lineId } = useParams<{ lineId: string }>();

  const {
    data: machineVision,
    error,
    isLoading
  } = useGetMachineVisionKpiQuery(
    {
      lineId,
      kpiDataInterval,
      machineVisionKpi: machineVisionKpiType,
      limit: 100000,
      includeHistoricData
    },
    {
      pollingInterval: 30000
    }
  );

  const result =
    machineVision &&
    machineVision.find((kpi: MachineVisionKpiItem) => {
      return kpi.id === machineVisionKpiType;
    });

  return { result, isLoading, error };
};

export default useMachineVisionKpi;
