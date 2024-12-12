import { BaseType, PaginatedResults } from 'types';

export enum BaseTagType {
  Tag = 'tag',
  State = 'state'
}

export interface BaseTagValue {
  timestamp: string;
  value: number | string;
}

export interface BaseTag {
  type: BaseTagType;
  id: string;
  name?: string;
  unit?: string;
  value?: BaseTagValue;
  values: BaseTagValue[];
}

export interface ProsealMachineProductionKpis {
  availability: BaseTag;
  oee: BaseTag;
  performance: BaseTag;
  packCount: BaseTag;
  feedFactor: BaseTag;
}

export interface ProsealMachineProductionAnalysisAllData extends BaseType {
  eventId: string;
  status: string;
  statusCategory: string;
  duration: number;
  recipe: string;
  startTime: string;
  endTime: string;
  isExternalError: boolean;
  isInternalError: boolean;
  isProduction: boolean;
  isRunning: boolean;
  packCount: number;
  packsPerMinute: number;
}

export interface PaginatedProsealMachineProductionAnalysisAllData<Type>
  extends PaginatedResults<Type> {
  allData?: ProsealMachineProductionAnalysisAllData[];
}

export interface ProsealExcelUrl extends BaseType {
  url: string;
}

export interface DowntimeRow extends BaseType {
  name: string;
  totalTime: number;
  productionShare: number;
  count: number;
  minTime?: number;
  maxTime?: number;
  averageTime?: number;
}

export interface ProsealDowntimeQueryParams extends BaseType {
  machineId: string;
  startDatetime?: string;
  endDatetime?: string;
}

export interface ProsealMachineProductionAllDataQueryParams extends BaseType {
  machineId: string;
  limit?: number;
  startDatetime?: string;
  endDatetime?: string;
}
export interface ProsealRecipeSegment extends BaseType {
  name: string;
  numberOfImpressions: number;
  job?: string;
  targetPacksPerMinute: number;
  startTime: string;
  endTime: string;
  kpis: {
    availability: number;
    performance: number;
    oee: number;
    totalPacks: number;
    totalSeconds: number;
  };
}

export interface ProsealRecipeStats extends BaseType {
  name: string;
  numberOfImpressions: number;
  avgPacksPerMin: number;
  targetPacksPerMin: number;
  avgFeedFactor: number;
  targetFeedFactor: number;
  avgOee: number;
}

export interface ProsealStatus extends BaseType {
  timestamp: string;
  packsPerMinute: number;
  machineStatus: string;
  statusCategory: string;
  isRunning: boolean;
  isError: boolean;
}

export interface ProsealAdminRecipe extends BaseType {
  id: string;
  recipeName: string;
  numberOfImpressions: number;
  targetPacksPerMinute: number;
}
