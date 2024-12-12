import { BaseType } from 'types';

export type MachineVisionKpiItem = {
  type: string;
  id: string;
  unit: string;
  target?: number;
  value: {
    timestamp: string;
    value: number;
    endTimestamp: string;
  };
  values: {
    timestamp: string;
    value: number;
    endTimestamp: string;
  }[];
};

export type ChartDataItem = {
  timestamp: string;
  value: number;
  endTimestamp: string;
};
export type MachineVisionKpi = MachineVisionKpiItem[];

export interface MachineVisionKpiQueryParams extends BaseType {
  lineId: string;
  kpiDataInterval: string;
  machineVisionKpi: string;
  limit: number;
  includeHistoricData: boolean;
}

export enum MachineVisionType {
  Throughput = 'Throughput',
  Weight = 'Cumulative Weight',
  Average = 'Average Size',
  InternalTemp = 'InternalTemp',
  TargetWeight = 'Cumulative Weight Target'
}

export enum MachineVisionInterval {
  Last8Hours = 'LAST_8_HOURS',
  CurrentDay = 'CURRENT_DAY'
}
