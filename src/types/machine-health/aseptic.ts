import { BaseType } from 'types/index';
import { Alarm } from 'types/machine-health/alarms';
import { Alert } from 'types/machine-health/alerts';

export type Unit = {
  id: string;
  tag: string;
  value: {
    value: number;
  };
  unit: string;
};
export interface MachineUtilization {
  productionUptime: number;
  productionUptimeDuration: number;
  productionDowntime: number;
  productionDowntimeDuration: number;
  sterilization: number;
  sterilizationDuration: number;
  cleaning: number;
  cleaningDuration: number;
  maintenance: number;
  maintenanceDuration: number;
  idle: number;
  idleDuration: number;
}
export interface LaneAlarms {
  lane1: number;
  lane8: number;
  lane12: number;
  lane5: number;
  lane7: number;
}
export interface MachineInfo {
  recipe_name: string;
  run_length_in_seconds: string;
  approvedbottles: string;
}
export interface LaneAlarmsBarChartType {
  x: string;
  y: number;
  color: string;
  showLabel: boolean;
  widget: string;
}
export interface asepticMachineUtilizationMapperType {
  Prod: string;
  'Production Downtime': string;
  Idle: string;
  Mainten: string;
  Cleaning: string;
  Steril: string;
}

// curl -X 'GET' \
//   'http://127.0.0.1:8000/aseptic/machine-health/dce5e9f4-bf5c-4b85-b506-e6183f2cd225/change-over/top'
export interface AsepticMachineHealthChangeoverTopRequestParams extends BaseType {
  machineId: string;
}

// curl -X 'GET' \
//   'http://127.0.0.1:8000/aseptic/machine-health/dce5e9f4-bf5c-4b85-b506-e6183f2cd225/change-over/changeover_id_9' \
export interface AsepticMachineHealthChangeoverByIdParams extends BaseType {
  machineId: string;
  changeoverId: string;
}

// curl -X 'GET' \
//    'http://localhost:3000/api/mh/v1/aseptic/machine-health/dce5e9f4-bf5c-4b85-b506-e6183f2cd225/
//    change-over-step-details?end_date=2023-01-20&start_datetime=2023-01-16%2012%3A13%3A17&' \

export interface AsepticMachineHealthChangeoverDetailsParams extends BaseType {
  machineId: string;
  end_datetime: string;
  start_datetime: string;
}

// curl -X 'GET' \
//   'http://127.0.0.1:8000/aseptic/machine-health/dce5e9f4-bf5c-4b85-b506-e6183f2cd225/change-over?
//   start_date=2022-06-01&end_date=2022-07-15&limit=25' \
export interface AsepticMachineHealthChangeoverByDateRangeRequestParams extends BaseType {
  machineId: string;
  start_date: string;
  end_date: string;
  limit?: number;
}

export interface TargetChangeOverDetailStep extends BaseType {
  recipe: number;
  recipeDescr: string;
  modeNumber: number;
  modeDescr: string;
  duration: string;
  avgDuration: string;
}

export interface ActualChangeOverDetail extends TargetChangeOverDetailStep {
  runLoginId: string;
  startTime: string;
  endTime: string;
  targetDiff: string;
  alarms: Alarm[];
  targetDuration?: string;
  targetDiffInMinutes?: number;
}

export interface AsepticChangeoverType extends BaseType {
  id: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime: string;
  active: boolean;
  previousRecipeDesc?: string;
  nextRecipeDesc?: string;
  status: string;
  duration?: string;
  actualDetails?: ActualChangeOverDetail[];
  targetDetails?: ActualChangeOverDetail[];
  alerts?: Alert[];
  waitTime?: string;
}

export interface AsepticChangeoverDetailType extends BaseType {
  id: string;
  sessionId: string;
  endTime: string;
  startTime: string;
  name: string;
  parentName: string;
}

export interface AsepticMachineHealthAlarmsByLaneRequestParams extends BaseType {
  machineId: string;
  kpiDataInterval: string;
}
