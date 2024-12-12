import React, { createContext, ReactNode, useContext } from 'react';
import { useFleetMachineAccountData } from './useFleetMachineAcountData';
import { useGetMachineHealthByIdQuery } from 'api';
import { MachineHealthKpiStatus } from 'types/machine-health';
import { MachineHealthProductionData } from 'types/machine-health';
import {
  NewMachineHealthKpi,
  MachineHealthKpiUnits,
  MachineHealthKpiDetail,
  PluData
} from 'types/machine-health';

const FleetMachineHealthByIdContext = createContext<FleetMachineHealthByIdContextReturnProps>({
  isLoading: true
});

export const useFleetMachineHealthById = (): FleetMachineHealthByIdContextReturnProps => {
  return useContext(FleetMachineHealthByIdContext);
};

interface Props {
  children?: ReactNode | ReactNode[];
}

export interface FleetMachineHealthByIdContextReturnProps {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  kpis?: NewMachineHealthKpi;
  uoms?: MachineHealthKpiUnits;
  cardsData?: Record<string, MachineHealthKpiDetail[]>;
  pluData?: Record<string, PluData>;
  machineProductionData?: MachineHealthProductionData[];
}

export const FleetMachineHealthByIdProvider = ({ children }: Props): JSX.Element => {
  const { machineId } = useFleetMachineAccountData();

  const { data } = useGetMachineHealthByIdQuery(`${machineId}`, {
    pollingInterval: 30000
  });

  const kpis = data?.machineKpis[0] || undefined;

  const pluData = kpis?.pluData;

  const machineProductionData = [];

  if (pluData) {
    for (const key in pluData) {
      //numberOfPluElements = numberOfPluElements + 1;
      machineProductionData.push({
        id: key,
        machine: key,
        oee: '',
        successfulCyclesActual: pluData[key]?.cyclecountPluHour?.[0]?.values?.actual ?? '',
        successfulCyclesTarget: pluData[key]?.cyclecountPluHour?.[0]?.values?.target ?? '',
        successfulCyclesStatus: pluData[key]?.cyclecountPluHour?.[0]?.threshold.status ?? '',
        weightActual: pluData[key]?.weightPluHour?.[0]?.values?.actual ?? '',
        weightTarget: pluData[key]?.weightPluHour?.[0]?.values?.target ?? '',
        weightStatus: pluData[key]?.weightPluHour?.[0]?.threshold.status ?? '',
        waitTime: pluData[key]?.waitTimePluHour?.[0]?.values?.actual ?? '',
        waitTimeStatus: pluData[key]?.waitTimePluHour?.[0]?.threshold.status ?? '',
        failCycles: pluData[key]?.failedCyclePluHour?.[0]?.values?.actual ?? '',
        failCyclesStatus: pluData[key]?.failedCyclePluHour?.[0]?.threshold.status ?? '',
        state: '',
        stateStatus: MachineHealthKpiStatus.NA,
        condition: '',
        conditionStatus: MachineHealthKpiStatus.NA
      });
    }
  }

  const value = {
    kpis,
    uoms: data?.kpiUom,
    cardsData: kpis?.data || undefined,
    pluData,
    machineProductionData
  };

  return (
    <FleetMachineHealthByIdContext.Provider {...{ value }}>
      {children}
    </FleetMachineHealthByIdContext.Provider>
  );
};
