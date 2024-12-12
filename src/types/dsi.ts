import { BaseType } from 'types';
import { ProteinMachineStateCategoryName } from 'types/protein';
import { Value } from 'components/KPICard/CardComponents';

/**
 * DSI
 */
export type DSIKPIInterval =
  | 'Last 15 min'
  | 'Last 30 min'
  | 'Last hour'
  | 'Last Shift'
  | 'Last Day'
  | 'Last Week'
  | 'Last Month'
  | 'Current Day';

export enum DSIKPIType {
  DsiCurrentKpi = 'DsiCurrentKpi',
  InfeedPieceSize = 'InfeedPieceSize',
  ThroughputRate = 'ThroughputRate',
  ThroughputPieceCount = 'ThroughputPieceCount',
  BeltSpeed = 'BeltSpeed',
  Loading = 'Loading',
  LoadingEfficiency = 'LoadingEfficiency',
  LoadingGap = 'LoadingGap',
  Yield = 'Yield',
  PressurizeAverageTime = 'Pressurization Time - Average',
  UnnecessaryPressurizationTime = 'Unnecessary Pressurization Time',
  ProductProcessed = 'ProcessedProductPercentage',
  OutputWeight = 'OutputWeight',
  OutputPiece = 'OutputPiece',
  PumpPressure = 'PumpPressure',
  MachineInfoOEE = 'MachineInfoOEE',
  PsuName = 'PsuName'
}
export enum DSIKpiId {
  CurrentPSU = 'psu_name',
  App = 'app_name',
  InfeedPiece = 'infeed_piece_size',
  ProductType = 'product_type',
  OeeCumulative = 'oee_cumulative',
  OeeAvailability = 'oee_availability_cumulative',
  OeePerformance = 'oee_performance_cumulative',
  OeeQuality = 'oee_quality_cumulative',
  StateName = 'state_name'
}

export enum SiteTableDataType {
  OEE = 'oee',
  Availability = 'availability',
  Performance = 'performance',
  Quality = 'quality'
}

export interface DSISiteTableData extends BaseType {
  id: string;
  description: string;
  lineName: string;
  status: ProteinMachineStateCategoryName;
  numCurrentAlarms: number;
  numAlarmsOverPeriod: number;
  productionOverPeriod: number;
  utilizationOverPeriod: number;
  oee: string;
  psu: string;
}

export type MachineKpiItem = {
  title: string;
  kpiType: string;
  value1?: Value;
  value2?: Value;
  value3?: Value;
  status?: string;
  targetStatus?: { label: string; value: string };
  values?: Value[];
};

export enum BusinessUnit {
  DSI = 'dsi',
  PROTEIN = 'protein',
  PASCAL = 'pascal',
  AVURE = 'avure'
}

export enum MachineHealthInterval {
  Last8Hours = 'LAST_8_HOURS',
  Last7Days = 'LAST_7_DAYS',
  Last3Days = 'LAST_3_DAYS',
  Last15Min = 'LAST_15_MINUTES',
  Last30Min = 'LAST_30_MINUTES',
  LastHour = 'LAST_HOUR',
  Last3Hours = 'LAST_3_HOURS',
  LastShift = 'LAST_SHIFT',
  LastDay = 'LAST_DAY',
  LastWeek = 'LAST_WEEK',
  LastMonth = 'LAST_MONTH',
  CurrentDay = 'CURRENT_DAY'
}

export enum MachineStateCodes {
  Offline = '1',
  NoProduct = '0',
  Running = '2',
  NotRunning = '5'
}

export enum MachineStateNames {
  Offline = 'Offline',
  NoProduct = 'No Product',
  Running = 'Running',
  NotRunning = 'Not Running'
}

export interface MachineStateRequestParams extends BaseType {
  machineId: string;
  startDatetime?: string;
  endDatetime?: string;
}
