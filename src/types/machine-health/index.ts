import { BaseType, Id, WithId } from 'types';

export type {
  CreateNewWidgetItemProps,
  TableRowProps,
  WidgetRowCrudProps,
  WidgetTableCustomExpandIcon,
  WidgetTableDataItem,
  WidgetTableDropdownItem,
  WidgetTableFormProps,
  WidgetTableProps,
  WidgetTableTitleProps
} from './widget-table';

export type Value = {
  key: string;
  content?: string | JSX.Element;
  weight?: number;
  height?: number;
  color?: string;
  bgColor?: string;
  clickable?: boolean;
};

export type KpiRow = {
  value?: Value;
  label?: string;
};

export type ConnectionStatus = 'good' | 'medium' | 'bad' | 'error' | 'never-connected' | null;
export type AccountInfoConnectionStatus = {
  watchdog: string;
  lastKnownConnected: string;
  gateway: string;
};
export enum MachineHealthKpiKey {
  WeightMachineHour = 'weightMachineHour',
  FailedCycleMachineHour = 'failedCycleMachineHour',
  CyclecountMachineHour = 'cyclecountMachineHour',
  WaitTimeMachineHour = 'waitTimeMachineHour',
  MachineState = 'machineState',
  MachineCondition = 'machineCondition',
  CyclecountPluShift = 'cyclecountPluShift'
}

export type MachineHealthKpiUnit =
  | null
  | 'lbs / cycle'
  | 'Total in last hour'
  | 'min. / cycle'
  | 'in shift';

export type MachineHealthKpiUnits = Record<MachineHealthKpiKey, MachineHealthKpiUnit>;

export interface MachineHealthKpi {
  value: number;
  unit: string;
  status?: 'at-risk' | 'warning';
}

export type MachineHealthStatus = 'running' | 'stopped-alarm';

export interface MachineHealthItem extends BaseType {
  id: number;
  component: string;
  status: MachineHealthStatus;
  data: { [kpi: string]: MachineHealthKpiDetail[] };
  actionNeeded?: string;
  state: SubComponentDataState;
}

export interface MachineHealthItemWithKey extends MachineHealthItem {
  key: string;
}

export type MachineHealthKpiValue = string | number;

export enum MachineHealthKpiStatus {
  Good = 'good',
  Warning = 'warning',
  Bad = 'bad',
  Running = 'running',
  NA = 'n/a',
  Disabled = 'disabled'
}

export interface MachineHealthKpiDetail extends BaseType {
  kpi: string;
  state?: MachineHealthKpiValue;
  values: {
    actual: MachineHealthKpiValue;
    target: null | MachineHealthKpiValue;
  };
  threshold: {
    status: MachineHealthKpiStatus;
    value: {
      actual: MachineHealthKpiValue;
      target: null | MachineHealthKpiValue;
    };
  };
}

export interface MachineHealthKpiUom extends BaseType {
  kpiUom: MachineHealthKpiUnits;
  machineKpis: NewMachineHealthKpi[];
}

export interface NewMachineHealthKpi extends BaseType, WithId {
  machineDesc: string;
  plantId: Id;
  data: { [kpi: string]: MachineHealthKpiDetail[] };
  pluData: { [plu: string]: PluData };
  subComponentData: { [key: string]: SubComponentData };
}

export interface PluData extends BaseType {
  [kpi: string]: MachineHealthKpiDetail[];
}

export interface SubComponentDataState {
  displayName: string;
  value: string;
}

export interface SubComponentData extends BaseType {
  action?: string;
  data: { [kpi: string]: MachineHealthKpiDetail[] };
  name: string;
  state: SubComponentDataState;
  status: MachineHealthStatus;
}

export interface MachineHealthProductionData extends BaseType {
  id: Id;
  machine: string;
  oee: string;
  successfulCyclesActual: MachineHealthKpiValue;
  successfulCyclesTarget: MachineHealthKpiValue;
  successfulCyclesStatus: MachineHealthKpiStatus;
  weightActual: MachineHealthKpiValue;
  weightTarget: MachineHealthKpiValue;
  weightStatus: MachineHealthKpiStatus;
  waitTime: MachineHealthKpiValue;
  waitTimeStatus: MachineHealthKpiStatus;
  failCycles: MachineHealthKpiValue;
  failCyclesStatus: MachineHealthKpiStatus;
  state: MachineHealthKpiValue;
  stateStatus: MachineHealthKpiStatus;
  condition: MachineHealthKpiValue;
  conditionStatus: MachineHealthKpiStatus;
}

/**
 *  Aseptic
 */
export type AsepticMachineHealthKpiItem = {
  type: string;
  id: string;
  unit: string;
  small_size_threshold: number;
  large_size_threshold: number;
  distance_edge_threshold: number;
  distance_between_threshold: number;
  modeNumber: string;
  modeDescr: string;
  recipeDescr: string;
  startTime: string;
  endTime: string;
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

export type AsepticMachineModesItem = {
  modeNumber: string;
  modeDescr: string;
  recipeDescr: string;
  startTime: string;
  endTime: string;
};

export type AsepticMachineModesGraphItem = {
  id: number;
  label: string;
  parentProperty: string;
  data: AsepticMachineModesBarItem[];
};

export type AsepticMachineModesBarItem = {
  stateCode: string;
  stateName: string;
  startTimestamp: string;
  endTimestamp: string;
};

export type AsepticMachineHealthKpi = AsepticMachineHealthKpiItem[];

export interface AsepticMachineHealthKpiQueryParams extends BaseType {
  machineId: string;
  kpiDataInterval: string;
  widgetType: string;
  limit: number;
  includeHistoricData: boolean;
}

export enum MachineType {
  Aseptic = 'aseptic',
  DSI = 'dsi',
  Avure = 'avure'
}

export enum AsepticMachineHealthType {
  Foil = 'Foil',
  MachineInfo = 'MachineInfo',
  LaneAlarms = 'LaneAlarms',
  MachineUtilization = 'MachineUtilization',
  Throughput = 'Throughput',
  OEE = 'OEE'
}

export enum AsepticMachineHealthInterval {
  Last8Hours = 'LAST_8_HOURS',
  Last7Days = 'LAST_7_DAYS',
  Last3Days = 'LAST_3_DAYS'
}

/**
 * DSI
 */

export type DSIMachineType = 'Nuggets 9065' | 'Fillets 8293';

export type MachineHealthKpiItem = {
  type: string;
  id: string;
  unit: string;
  value: {
    timestamp: string;
    value: number;
    endTimestamp: string;
    target?: number;
    status?: string;
  };
  values: {
    timestamp: string;
    value: number;
    endTimestamp: string;
    target?: number;
    status?: string;
    appName?: string[];
    psuName?: string;
  }[];
};

export interface MachineHealthKpiQueryParams extends BaseType {
  machineId: string;
  kpiDataInterval: string;
  widgetType: string;
  limit: number;
  includeHistoricData: boolean;
  skipValue?: number;
  totalValuesDesired?: number;
}

export interface MachineHealthProductTypeKpiQueryParams extends BaseType {
  startDatetime: string;
  endDatetime: string;
}
