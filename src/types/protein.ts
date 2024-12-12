import { BaseType, ResourceType } from '.';
import {
  AccountInfoConnectionStatus,
  ConnectionStatus,
  WidgetTableDataItem
} from './machine-health';
import {
  Alert,
  AlertConfigAlertLocation,
  AlertCriticality,
  AlertStateType
} from './machine-health/alerts';
import { LineViewWidgetTableDataItem } from './machine-health/widget-table';
import { Alarm, AlarmLocation } from 'types/machine-health/alarms';
import { BusinessUnit, MachineStateNames } from 'types/dsi';

export interface ProteinMachineRouteQueryParams {
  machineId: string;
}

// Generic query params type for a query that requires only machine id
export interface MachineQueryParams extends BaseType {
  machineId: string;
  numbersOnly?: 'true' | 'false';
  languageId?: string;
}

export interface TemplateQueryParams {
  machineId: string;
  templateId: string;
}

// Generic query params type for a query that requires machine id and time range
export interface MachineTimeRangeQueryParams extends BaseType, MachineQueryParams {
  startDatetime: string;
  endDatetime?: string;
}

export enum ProteinMachineState {
  Idle = 0,
  WaitingTobeSelected = 1,
  SelectedWaitingToBeStarted = 2,
  StartingUp = 3,
  Running = 4,
  PausedByOperatorOrExternal = 5,
  Stop = 6,
  ShutDownActive = 8,
  CompletedWaitingForOperator = 9,
  Alarm = 10,
  CriticalAlarm = 11,
  Warning = 12,
  PauseInProgress = 13
}

export enum ProteinMachineStateCategoryName {
  Cleaning = 'cleaning',
  Running = 'running',
  Alarm = 'alarm',
  Stop = 'stop',
  StopAlarm = 'stop_alarm',
  Idle = 'idle'
}

export interface StatePeriod {
  stateCode: string | ProteinMachineCategoryStates | ProteinMachineState;
  stateName: string;
  recipeName?: string;
  startTimestamp: string;
  endTimestamp: string;
}

export enum BaseTagType {
  Tag = 'tag',
  State = 'state'
}

export interface BaseTagValue {
  timestamp: string;
  value: number | string;
}

export interface BaseTagStateValue extends BaseTagValue {
  name: string;
  endTimestamp: string;
}

export enum BaseTagDataType {
  Float = 'float',
  Boolean = 'boolean',
  String = 'string',
  Integer = 'integer'
}

export enum BooleanTagDisplayValue {
  On = 'On',
  Off = 'Off'
}

// Value of a state, inside a configured widget response
export interface ConfiguredTagStateValue extends BaseTagValue {
  value: number;
  name: string;
}

export interface MetaTagData {
  dataType: BaseTagDataType;
}

export interface MachineTagExtrinsics {
  groupId?: string;
  groupName?: string;
  mainTag?: boolean;
  color?: string;
  [key: string]: unknown;
}

// New base tag type. API responses should match this type going forward
export interface BaseTag {
  id: string;
  meta?: MetaTagData;
  name?: string;
  type: BaseTagType;
  unit?: string;
  extrinsics?: MachineTagExtrinsics;
  values: (BaseTagValue | BaseTagStateValue | ConfiguredTagStateValue)[];
}

// Original base tag type, possibly marked for deprecation, as API responses move away from this structure
// and use BaseTag instead
export interface Tag extends BaseType {
  name?: string;
  tagId: string;
  unit: string;
  extrinsics?: MachineTagExtrinsics;
  value: string | number | null;
  valueType?: string;
}

export interface PowerBiItem extends BaseType {
  machineDescription: string;
  machineId: string;
  reportId: string;
  workspaceId: string;
}

// Cleaning
export enum CleaningStepCategories {
  Rinse = 1,
  Defrost = 2,
  Filling = 3,
  Inspection = 4,
  Disinfection = 5,
  Drying = 6,
  Detergent = 7,
  Complete = 8,
  UndefinedSequence = 9,
  EvaporatorEquipmentDefrostRinse = 10,
  EvaporatorDefrost = 11,
  ConveyorDefrost = 12,
  InvalidGroup = 13,
  Cooldown = 14,
  PreRinse = 15,
  Chemical = 16,
  Neutralization = 17,
  Sanitation = 18,
  Undefined = 19,
  Manual = 20,
  Caustic = 21,
  SteamSanitize = 22
}

export enum CleaningStepStatus {
  Completed = 'completed'
}

interface CleaningStepKPI {
  value: string;
  unit: string;
  label: string;
}

// Base cleaning step type
export interface CleaningStep extends BaseType {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  parentName: string;
  sessionId: string;
}

// Grouped cleaning steps with KPI data, for session steps table
export interface CleaningStepWithKPI extends CleaningStep {
  status: CleaningStepStatus | string;
  avgOverTime?: number;
  kpis: CleaningStepKPI[];
  subSteps?: CleaningStepWithKPI[];
  alarms?: Alarm[];
  alerts?: Alert[];
  targetDuration?: string;
  targetDiffInMinutes?: number;
  duration?: string;
}

// Cleaning step decorated with additional derived data
export interface DecoratedCleaningStep extends CleaningStep {
  // Duration in milliseconds
  duration: number;
  // Date representations of start and end times
  startDateTime: Date;
  endDateTime: Date;
}

// Decorated cleaning steps grouped by their id
export interface CleaningStepGroup extends BaseType {
  id: string;
  name: string;
  parentName: string;
  steps: DecoratedCleaningStep[];
  duration: number; // In milliseconds
  percent: number;
  minDuration: number; // In milliseconds
  maxDuration: number; // In milliseconds
  averageDuration: number; // In milliseconds
}

// Individual cleaning session
export interface CleaningSession extends BaseType {
  startTimestamp: string;
  endTimestamp?: string;
  alarms: number;
  id?: string;
}

export interface MachineCleaningSessionsRequestParams extends BaseType {
  machineId: string;
  startDatetime: string;
  endDatetime: string;
}

export interface MachineCleaningStepRequestParams extends BaseType {
  machineId: string;
  startDatetime: string;
  endDatetime?: string;
  avgSessions?: number;
  grouped?: boolean;
  alarmsInfo?: boolean;
}

export interface UtilityMetrics extends BaseType {
  status: string;
}

export interface CleaningSessionsKpi extends BaseType {
  avgDuration: number;
  recipe: string;
}

export interface MachineAlarmRequestParams extends BaseType {
  machineId: string;
  locationId?: AlarmLocation;
  startDatetime: string;
  endDatetime?: string;
}

export interface PressurizeCycleRequestParams extends BaseType {
  startDatetime: string;
  endDatetime?: string;
  limit?: number;
}

export interface PressurizedTimeAverageRequestParams extends BaseType {
  startDatetime: string;
  endDatetime?: string;
}

export interface PressurizedTimeAverageReturnProps extends BaseType {
  [key: string]: unknown;
}

export interface PressurizeCycle extends BaseType {
  systemId: string;
  batchNumber: string;
  lotId: string;
  batchSuccessful: boolean;
  startTime: string;
  endTime: string;
  idealPressurizeTime: number;
  pressurizeTime: number;
  watertankTempMax: number;
}
export interface PressurizeState extends BaseType {
  machineState: string;
  totalTimeSeconds: number;
  status: string;
  modeKey: number;
}
/**
 * Data Analysis
 */
export interface MachineTagsModel extends Tag {
  right?: boolean;
  left?: boolean;
}

export interface DataAnalysisProperty extends BaseType {
  property: string;
  value: string | number | Date | null;
}

export interface DataAnalysisYAxisMinMax extends BaseType {
  left?: boolean;
  right?: boolean;
  min: number | null;
  max: number | null;
}

export interface DataAnalysisTag extends BaseType {
  tagCode: string;
  isLeftSide: boolean;
}
export interface DataAnalysisView extends BaseType {
  viewName: string;
  viewId?: string;
  timestampCreated?: string;
}

export interface DataAnalysisViewDetails extends DataAnalysisView {
  tags: DataAnalysisTag[];
  properties: DataAnalysisProperty[];
}

export enum DataAnalysisPropTypes {
  MaxDataPoints = 'Maximum data point',
  TotalRowsDisplayed = 'Total rows displayed',
  FirstYAxisMin = 'First Y-axis Minimum',
  FirstYAxisMax = 'First Y-axis Maximum',
  SecondYAxisMin = 'Second Y-axis Minimum',
  SecondYAxisMax = 'Second Y-axis Maximum'
}

// TODO: get template props from api
export const DataAnalysisDefaultProps = [
  {
    property: DataAnalysisPropTypes.MaxDataPoints,
    value: 10000
  } as DataAnalysisProperty,
  {
    property: DataAnalysisPropTypes.TotalRowsDisplayed,
    value: 1000
  } as DataAnalysisProperty,
  {
    property: DataAnalysisPropTypes.FirstYAxisMin,
    value: ''
  } as DataAnalysisProperty,
  {
    property: DataAnalysisPropTypes.FirstYAxisMax,
    value: ''
  } as DataAnalysisProperty,
  {
    property: DataAnalysisPropTypes.SecondYAxisMin,
    value: ''
  } as DataAnalysisProperty,
  {
    property: DataAnalysisPropTypes.SecondYAxisMax,
    value: ''
  } as DataAnalysisProperty
];

/**
 * Cleaning
 */
export interface CleaningState extends BaseType {
  stateCode: ProteinMachineState;
  stateName: string;
  startTimestamp: string;
  endTimestamp: string;
}

export interface MachineCleaningStateRequestParams extends BaseType {
  machineId: string;
  startDatetime: string;
  endDatetime?: string;
  waitingTime?: boolean;
}

export interface MachineCleaningStateUtilityMetricsKpiRequestParams extends BaseType {
  machineId: string;
  startDatetime: string;
  endDatetime?: string;
}

export interface MachineCleaningSessionsKpiRequestParams extends BaseType {
  machineId: string;
  avgSessions?: number;
}

export interface MachineOverviewTag extends Tag {
  mainTag: string;
  tagGroupId?: string;
  tagGroupName?: string;
}

export interface MachineMasterTag extends Tag {
  id: string;
  friendlyName: string;
  language: string;
  unitClassId: string;
  unitClassName?: string;
  dataType?: string;
}

export interface MachineTagType {
  id: string;
  value: BaseTagDataType;
  name: string;
}

export interface LastCleaningSession extends BaseType {
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  alarms: number;
}

export interface MachineProductionMetrics {
  productionTime?: number;
  throughput?: number;
}

export interface KeyIndicatorHistory extends MachineOverviewTag {
  values: {
    value: number | string;
    timestamp: number | string;
  }[];
}
export interface KeyIndicatorsHistoryQueryParams extends BaseType, MachineQueryParams {
  startDatetime: string;
  endDatetime?: string;
}

export interface MachineAccountInfoQueryParams {
  machineId: string;
}

export interface AccountInfo {
  id: string;
  plantId: string;
  orgId: string;
  nickname: string;
  description: string;
  serialNumber: string;
  warrantyExpired: boolean;
  procare: boolean;
  order: string;
  companyName: string;
  siteName: string;
  lineName: string;
  currProdState: string;
  bottleneck: boolean;
  salesforceId: string;
  connectionStatus: AccountInfoConnectionStatus;
  reportingState: string;
  tags: Tag[];
  machineTypeCd: string;
  reportId: string;
  workspaceId: string;
  powerBiList?: PowerBiItem[];
}

export interface MachineUtilizationQueryParams extends BaseType, MachineQueryParams {
  startDatetime?: string;
  endDatetime?: string;
}

export interface MachineUtilization {
  running: number;
  runningDuration: number;
  stopped: number;
  stoppedDuration: number;
  cleaning: number;
  cleaningDuration: number;
  idle: number;
  idleDuration: number;
  stopAlarm: number;
  stopAlarmDuration: number;
}

export interface DataAnalysisProperties extends BaseType {
  id: number;
  name: string;
  unit: string;
  right: boolean;
  left: boolean;
  enabled: boolean;
  link: string;
  fullname: string;
}
export type ConnectionStatusResponse = {
  watchdog: ConnectionStatus;
  gateway: ConnectionStatus;
};

/**
 * Dynamic page/widget rendering
 */
export enum TopLevelTabs {
  MachineHealth = 'MH',
  MachinePerformance = 'MP'
}

export enum LineViewMachine {
  LineViewMachine = 'LV_MACHINE'
}

export enum MachineHealthTabs {
  Overview = 'MH_OV',
  ProductProcessing = 'MH_PP',
  ProductMovement = 'MH_PM',
  Cleaning = 'MH_CLE',
  Alarms = 'MH_ALARM',
  DataAnalysis = 'MH_DA'
}

export enum MachinePerformanceTabs {
  Current = 'MP_CD',
  HistoricRecipes = 'MP_HR'
}

export enum MachinePerformanceSubTabs {
  Current = 'MP_CD_MAIN',
  HistoricRecipes = 'MP_HR_MAIN'
}

export enum MachineHealthSubTabs {
  OverviewMain = 'MH_OV_MAIN',
  OverviewFlyout = 'MH_OV_FLYOUT',
  PPOverview = 'MH_PP_OV',
  PMOverview = 'MH_PM_OV',
  CLESingleSession = 'MH_CLE_SS',
  CLEStepsOverTime = 'MH_CLE_SOT',
  CLEExtraSensors = 'MH_CLE_ES'
}

export enum WidgetType {
  Alerts = 'alerts_widget',
  CurrentIssues = 'current_issues',
  DurationChart = 'duration_chart',
  KpiCard = 'kpi_card',
  MachineImage = 'machine_image',
  MachineOverview = 'machine_overview_widget',
  MachineOverviewFlyout = 'machine_overview_flyout_widget',
  MachineOverviewZone = 'machine_overview_zone_widget',
  MachineOverviewFlyoutZone = 'machine_overview_flyout_zone_widget',
  MachineUtilization = 'machine_utilization',
  CleaningLastSession = 'cleaning_last_session',
  KeyIndicatorsHistory = 'key_indicators_history',
  MatrixWidget = 'matrix_widget',
  MatrixWidgetGroup = 'matrix_widget_group',
  None = '',
  ProductionMetrics = 'production_metrics',
  RatioChart = 'ratio_chart',
  State = 'state',
  Structure = 'structure',
  TagGroup = 'tag_group',
  TagGroupRow = 'tag_group_button_row',
  TagRow = 'tag_button_row',
  TorqueChart = 'torque_chart',
  WidgetRow = 'widget_button_row'
}

export enum WidgetClass {
  Structure = 'structure',
  Widget = 'widget'
}

// New style widget integration
export interface ConfiguredWidget {
  id: string;
  label?: string;
  name?: string;
  widgetClass: string;
  members?: ConfiguredWidget[];
  tags?: BaseTag[];
  active: boolean;
}

export interface DynamicNavigationTabWithSlug extends ConfiguredWidget {
  slug: string;
}

export interface ConfiguredWidgetQueryParams extends BaseType {
  machineId: string;
  labels?: string[];
  includeTagValues?: boolean;
  widgetClasses?: WidgetClass[];
  showInactive?: boolean;
  languageId?: string;
}

/**
 * Product Processing / Product Movement
 */
export interface MachineThermalStatesQueryParams extends BaseType {
  machineId: string;
  startDatetime: string;
  endDatetime: string;
}

export interface MachineConfiguratorQueryParams extends BaseType {
  machineId: string;
  labels: string[];
  languageId?: string;
}

export interface MachineConfiguratorPatchQueryParams extends BaseType {
  machineId: string;
  widget: WidgetTableDataItem | LineViewWidgetTableDataItem;
  languageId: string;
}

export interface MachineConfiguratorCopyQueryParams extends BaseType {
  machineId: string;
  configuration: WidgetTableDataItem[];
  languageId?: string;
}

export interface MachineWidgetQueryParams extends BaseType {
  depth?: number;
  includeTagValues?: boolean;
  machineId: string;
  showInactive?: boolean;
  widgetClasses?: string[];
  widgetId: string;
  languageId?: string;
}

export interface MasterTagListQueryParams extends BaseType {
  businessUnitId: number;
}

export interface ThermalState {
  label: string;
  tagId: string;
  states: StatePeriod[];
}

export interface ThermalStatesLatest {
  label: string;
  tagId: string;
  states: StatePeriod[];
}

export interface MachineDriveSystemStatesQueryParams extends BaseType {
  machineId: string;
  startDatetime: string;
  endDatetime: string;
}

export enum ProteinMachineCategoryStates {
  Idle = 10,
  Running = 40,
  Cleaning = 41,
  Stop = 50,
  StopByAlarm = 51
}
export interface SiteTableDataType extends BaseType {
  machine?: string;
  lines?: string;
  status?: ProteinMachineCategoryStates;
  issuesCurrent?: number;
  issuesPast?: number;
  line?: number;
  configurationType?: string;
  production?: string;
  utilization?: string;
}
export interface LineState {
  machineId: string;
  machineName: string;
  states: StatePeriod[];
}

export interface ContactInfo extends BaseType {
  name: string;
  role: string;
  email: string;
  phone: string;
}

/**
 * Overview
 */

export interface MachineStatesCategoriesQueryParams extends BaseType, MachineQueryParams {
  startDatetime: string;
  endDatetime?: string;
}

export interface StateCategory extends BaseType {
  value: number;
  name: string;
  timestamp: string;
  endTimestamp: string;
}

export interface LineStates {
  entityId: string;
  id: string;
  type: string;
  values: StateCategory[];
}

export interface LineMachineStates extends LineStates {
  meta: {
    bottleneck: boolean;
    description: string;
    machineType: string;
    serialNumber: string;
  };
}

export interface MapStyler {
  color?: string;
  visibility?: string;
}
export interface MapStyle extends BaseType {
  elementType: string;
  featureType?: string;
  stylers: MapStyler[];
}

/*
 * Data analysis
 */
export interface MachineTagsHistoryQueryParams extends BaseType, MachineQueryParams {
  startDatetime: string;
  endDatetime: string;
  tagCodes: string[];
  interpolation?: boolean;
  limit?: number;
}

export interface TemplateInput extends BaseType {
  viewName: string;
  tags: DataAnalysisTag[];
  properties: DataAnalysisProperty[];
}

export interface TemplateResponse {
  createdAt: string;
  machineId: string;
  viewId: string;
  viewName: string;
}

/**
 * Site / Line views
 */
export interface SiteRouteQueryParams {
  plantId: string;
  businessUnit?: BusinessUnit;
}

export interface LineRouteQueryParams {
  lineId: string;
}

export interface LineMachinesStatesQueryParams extends BaseType {
  lineId: string;
  startDatetime: string;
  endDatetime?: string;
}

export type SiteTableType = 'LINE' | 'MACHINE';

export interface MachineLineStatus extends BaseType {
  id: string;
  description: string;
  lineName: string;
  status: ProteinMachineStateCategoryName | MachineStateNames;
  numCurrentAlarms: number;
  numAlarmsOverPeriod: number;
  productionOverPeriod: number;
  utilizationOverPeriod: number;
  downtimeOverPeriod: number;
}

export interface LineStatus extends BaseType {
  id: string;
  name: string;
  plantId: string;
  status: ProteinMachineStateCategoryName | MachineStateNames;
  numCurrentAlarms: number;
  numAlarmsOverPeriod: number;
  productionOverPeriod: number;
  utilizationOverPeriod: number;
  downtimeOverPeriod: number;
}

export interface LineInfo extends BaseType {
  id: string;
  name: string;
  plantId: string;
  timezone: string;
}

export interface LineViewImageParams extends LineRouteQueryParams {
  assetType: ResourceType;
}

// Hard-coded machine IDs used for temporary work-arounds, testing
export enum MachineId {
  PilgrimsWacoFrigoscandia = 'f026d81a-1589-4755-8bfc-1197b7a786d7'
}

/**
 *  Machine Configurator
 */

export interface MachineMasterTagQueryParams extends BaseType {
  businessUnitId: number;
  languageId?: string;
}

export interface MachineClassUnit {
  unit: string;
  businessUnitId: number;
}

export interface MachineUnitClass extends BaseType {
  id?: string;
  name: string;
  units: MachineClassUnit[];
}

export interface MachineMasterTagDeleteParams extends BaseType {
  businessUnitId: number;
  tagId: string;
}

export interface MachineMasterTagUpdateParams extends BaseType {
  tagId: string;
  businessUnitId: number;
  friendlyName?: string;
  unitClassId?: string;
  languageId?: string;
}

export interface AlertConfigQueryParams extends BaseType {
  activeOnly?: boolean;
  importances?: AlertCriticality[];
  includeMarkExpunged?: boolean;
  locations?: AlertConfigAlertLocation[];
  machineIds: string[];
  machineStates?: AlertStateType[];
  languageId?: string;
}

export enum DataAnalysisTagStatus {
  Active = 'Active',
  AllTags = 'All Tags'
}

export enum ConfigActiveTab {
  MachineHealth,
  MachinePerformance,
  Alerts,
  Reports
}
