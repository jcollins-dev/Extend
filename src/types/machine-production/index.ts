import { BaseType } from '../';

export interface MachineProductionKpiQueryParams extends BaseType {
  machineId: string;
  limit?: number;
  includeHistoricData?: boolean;
}

export interface UpdateProsealAdminRecipeQueryParams extends BaseType {
  recipeId: string;
  targetPacksPerMinute: number;
}
