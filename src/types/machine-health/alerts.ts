/**
 * Alerts
 */
import { BaseType } from 'types';
import { AlertsTableDropdownItem } from './widget-table';

export enum AlertStatus {
  Complete = 'completed',
  NotComplete = 'not_complete'
}

export enum AlertType {
  Operations = 'operations',
  Maintenance = 'maintenance'
}

export const AlertTypeLabel = {
  [AlertType.Operations]: 'Operational',
  [AlertType.Maintenance]: 'Maintenance'
};

export enum AlertLocation {
  Cleaning = 'Cleaning',
  ProductProcessing = 'Product processing',
  ProductMovement = 'Product movement'
}

export interface AlertQueryParams extends BaseType {
  machineId: string;
  location?: AlertLocation;
  startDatetime?: string;
  endDatetime?: string;
  status?: AlertStatus;
}

export interface MachineAlertQueryParams extends BaseType {
  active?: boolean;
  machineId: string;
  importances?: AlertCriticality[];
  locations?: AlertConfigAlertLocation[];
  machineStates?: AlertStateType[];
  startDatetime?: string;
  endDatetime?: string;
}

export interface Alert {
  id: string;
  description: string;
  alertType: AlertType;
  createdAt: string;
  status: AlertStatus;
}

export interface AlertDetail extends Alert {
  subcomponent: string;
  criticality: AlertCriticality;
  detailedInstructions: string;
}

export interface AlertDetailQueryParams {
  machineId: string;
  alertId: string;
}

export interface AlertDataScienceSurvey extends BaseType {
  id: string;
  alertId: string;
  issueType?: AlertDataScienceIssueType;
  ignoreReason?: string;
  other?: string;
  detail?: string;
}

export enum AlertDataScienceSurveyOpenType {
  DetailType = 'detail',
  IgnoreSurveyType = 'ignore'
}

export enum AlertDataScienceIssueType {
  SensorIssue = 'Sensor',
  MechanicalIssue = 'Mechanical',
  NoIssue = 'No Issue',
  Other = 'Other',

  // Not visible in the UI but required for API POST requests
  Ignored = 'Ignored'
}

export enum AlertDataScienceIgnoreReasons {
  TOO_MANY = 'Too Many Alert Notifications',
  NOT_USEFUL = 'Alert Notifications Not Useful',
  OTHER = 'Other'
}

export enum AlertCriticality {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum AlertConfigType {
  SetPoint = 'set_point',
  Threshold = 'threshold',
  Boolean = 'boolean',
  DeviationFromMean = 'deviation_from_mean',
  MultiTrigger = 'alert_multi_trigger'
}

export const AlertConfigTypeDescription = {
  [AlertConfigType.SetPoint]: 'set_point_description',
  [AlertConfigType.Threshold]: 'threshold_description',
  [AlertConfigType.Boolean]: 'boolean_description',
  [AlertConfigType.DeviationFromMean]: 'deviation_from_mean_description',
  [AlertConfigType.MultiTrigger]: 'alert_multi_trigger_description'
};

export enum AlertStateType {
  PRODUCTION = 'Production',
  CLEANING = 'Cleaning',
  MANUAL_MODE = 'Manual Mode'
}

export enum AlertBoolean {
  TRUE = 'true',
  FALSE = 'false'
}

export enum AlertColor {
  ORANGE = 'orange',
  RED = 'red'
}

export enum AlertTriggerValueFormat {
  ABSOLUTE = 'absolute',
  PERCENTAGE = 'percentage'
}

export interface AlertConfigColoredAlert {
  upperTrigger?: number;
  lowerTrigger?: number;
}

export enum AlertConfigAlertLocation {
  Cleaning = 'Cleaning',
  ProductProcessing = 'Product Processing',
  ProductMovement = 'Product Movement'
}

export enum AlertConfigTimeHorizon {
  TODAY = 'today',
  PREVIOUS_DAY = 'previous_day',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month'
}

export const AlertConfigTimeHorizonLabel = {
  [AlertConfigTimeHorizon.TODAY]: 'Today',
  [AlertConfigTimeHorizon.PREVIOUS_DAY]: 'Previous Day',
  [AlertConfigTimeHorizon.THIS_WEEK]: 'This Week',
  [AlertConfigTimeHorizon.LAST_WEEK]: 'Last Week',
  [AlertConfigTimeHorizon.THIS_MONTH]: 'This Month',
  [AlertConfigTimeHorizon.LAST_MONTH]: 'Last Month'
};

export interface AlertConfigTriggerRule {
  id?: string;
  dataSourceType: 'tag' | 'kpi'; // Always 'tag' until 'kpi' is implemented
  dataSource?: AlertsTableDropdownItem; // This is the source tag
  triggerRule?: AlertConfigType; // alert type
  triggerValueFormat?: AlertTriggerValueFormat;
  orangeAlertRangeUpper?: number;
  orangeAlertRangeLower?: number;
  orangeAlertBoolean?: AlertBoolean;
  orangeAlertDeviationFromMean?: number;
  redAlertRangeUpper?: number;
  redAlertRangeLower?: number;
  redAlertBoolean?: AlertBoolean;
  redAlertDeviationFromMean?: number;
  targetSetpoint?: AlertsTableDropdownItem; // This is the target setpoint (tag)
  targetBoolean?: AlertBoolean;
  booleanAlertColor?: AlertColor;
  timeframeOfMeanCalculation?: AlertConfigTimeHorizon;
}

// This is the alert configuration that is sent to the API
export interface AlertConfig extends BaseType {
  id?: string;
  machineId?: string;
  name?: string;
  description?: string;
  importance?: AlertCriticality;
  location?: AlertConfigAlertLocation[];
  machineState?: AlertStateType[];
  contacts?: string[]; // future use
  active?: boolean; // enable/disable
  expunge?: boolean; // marks if alert is deleted
  conditions?: AlertConfigTriggerRule[];
  minimumOccurrences?: number; // # of occurrences before alert triggers
}

// This is the alert type that is returned from the API
export interface MachineAlert extends BaseType {
  id: string;
  machineId: string;
  alertConfigurationId: string;
  triggerRule?: AlertConfigType;
  description?: string;
  importance?: AlertCriticality;
  severity?: AlertColor;
  machineState?: AlertStateType;
  startTimestamp?: string;
  endTimestamp?: string;
}

export interface IDeleteAlert extends BaseType {
  alertId: string;
}
export interface IReminder extends BaseType {
  value: number;
  units: string;
  stop_after: number;
  id: string;
  alert_id: string;
}

export interface ITrigger extends BaseType {
  type: string;
  value: number;
  units: null | string;
  id: string;
  alert_id: string;
}

export interface IGetAlerts extends BaseType {
  name: string;
  state: string;
  priority: string;
  message: string;
  description: null | string;
  frequency_value: number;
  frequency_units: string;
  sliding_window_value: number;
  sliding_window_units: string;
  /* eslint-disable-next-line */
  root_logic_group: any;
  simulation: null;
  trigger: ITrigger | null;
  reminder: IReminder | null;
  user_ids: string[];
  user_group_ids: string[];
  id: string;
  machine_id: string;
}
export interface SaveAlertPayload extends BaseType {
  data: TAlertData;
  machineId?: string;
}

export interface AlertEnumTypes {
  alertState: ('ENABLED' | 'DISABLED' | 'DRAFT')[];
  alertPriority: ('HIGH' | 'MEDIUM' | 'LOW')[];
  alertFrequencyUnits: ('SECONDS' | 'MINUTES' | 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS')[];
  slidingWindowUnits: ('SECONDS' | 'MINUTES' | 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS')[];
  logicOperator: ('AND' | 'OR')[];
  logicStatementValueType: ('STRING' | 'INTEGER' | 'FLOAT')[];
  logicStatementRelativity: ('UPPER' | 'LOWER')[];
  logicStatementComparisonOperator: (
    | 'EQUAL'
    | 'NOT_EQUAL'
    | 'GREATER_THAN'
    | 'GREATER_THAN_OR_EQUAL'
    | 'LESS_THAN'
    | 'LESS_THAN_OR_EQUAL'
    | 'BETWEEN'
    | 'CONTAINS'
  )[];
  reminderUnits: ('HOURS' | 'DAYS' | 'MONTHS')[];
  triggerType: ('MATCHES' | 'DURATION')[];
  triggerUnits: ('SECONDS' | 'MINUTES' | 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS')[];
}

export type PRIORITY = AlertEnumTypes['alertPriority'][number];
export type ALERT_STATE = AlertEnumTypes['alertState'][number];
export type SLIDING_WINDOW_UNITS = AlertEnumTypes['slidingWindowUnits'][number];
export type ALERT_FREQUENCY_UNITS = AlertEnumTypes['alertFrequencyUnits'][number];
export type REMINDER_UNITS = AlertEnumTypes['reminderUnits'][number];
export type TRIGGER_TYPE = AlertEnumTypes['triggerType'][number];
export type TRIGGER_UNITS = AlertEnumTypes['triggerUnits'][number];

export type ValidationErrors = {
  name?: string | null;
  message?: string | null;
};

export type TReminder = {
  value?: number | undefined;
  stop_after?: number | undefined;
  units?: REMINDER_UNITS | undefined;
  id?: string | undefined;
  alertId?: string | undefined;
};

export type TTrigger = {
  type?: TRIGGER_TYPE;
  value?: number | undefined;
  units?: TRIGGER_UNITS | undefined;
  id?: string | undefined;
  alertId?: string | undefined;
};

export interface QueryBuilderRule {
  id: string;
  combinator: string;
  rules: RuleGroup[];
  parent_logic_group_id?: string;
}

export interface RuleGroup {
  id: string;
  combinator: string;
  parent_logic_group_id?: string;
  logicGroupId?: string;
  rules: RuleCondition[];
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: string;
  id: string;
  logicGroupId?: string;
  statementValuesIds?: {
    logicStatementId?: string;
    id?: string;
  }[];
}

export interface LogicStatement {
  id?: string;
  logic_group_id?: string;
  tag_id: string;
  business_unit_id: number | undefined;
  comparison_operator: string;
  position: number;
  logic_statement_values: {
    value?: string | number;
    value_type?: string;
    business_unit_id?: number | undefined;
    tag_id?: string;
    relativity?: string;
  }[];
}

export interface LogicGroup {
  logic_operator: string;
  name: string;
  position: number;
  logic_statements: LogicStatement[];
}

export interface queryBuilderDesireRule {
  logic_operator: string;
  name: string;
  position: number;
  id?: string;
  alert_id?: string;
  parent_logic_group_id?: string;
  logic_groups: LogicGroup[];
  logic_statements: LogicStatement[];
}

export type TAlertData = {
  name: string | undefined;
  description?: string | undefined;
  message: string | undefined;
  state: ALERT_STATE;
  priority: PRIORITY;
  machineId?: string | undefined;
  id?: string | undefined;
  slidingWindowValue: number | undefined;
  slidingWindowUnits: SLIDING_WINDOW_UNITS | undefined;
  frequencyValue: number | undefined;
  frequencyUnits: ALERT_FREQUENCY_UNITS | undefined;
  reminder?: TReminder;
  trigger?: TTrigger;
  rootLogicGroup?: queryBuilderDesireRule;
};

export interface AlertStatementTag {
  tagId: string;
  name: string;
  value: number;
  valueType: string | null;
  unit: string;
  timestamp: string | null;
  endTimestamp: string | null;
  tagGroupId: string;
  tagGroupName: string;
  mainTag: string;
}
