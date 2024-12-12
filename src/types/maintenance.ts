import { BaseType, Id, Paginated, Sortable, WithId } from '.';

export enum MaintenanceTaskStatus {
  Completed = 'completed',
  NotComplete = 'not_complete'
}

export enum MaintenanceTaskType {
  AssignAndSchedule = 'assign_and_schedule',
  Complete = 'complete',
  Order = 'order',
  FollowUp = 'follow_up'
}

export enum MaintenanceCreator {
  Manufacturer = 'manufacturer',
  Predictive = 'predictive',
  Customer = 'customer',
  User = 'user'
}

export enum PMOpenType {
  CloseoutSurveyType = 'survey',
  PartsType = 'parts',
  AssignAndSchedule = 'assign_schedule',
  PredictiveAlertType = 'alert',
  None = ''
}

export enum MaintenanceFrequencyType {
  Cycles = 'cycles',
  Days = 'days',
  RunHours = 'run_hours',
  Sip = 'sip'
}

export interface MaintenanceTaskSurvey extends BaseType {
  assignedTo: string;
  completionDate: Date;
  cycleCount: number;
  duration: string;
  comments: string;
  plannedCompletion: boolean;
  needFollowUp: boolean;
}

export enum MaintenanceEventStatus {
  NotComplete = 'not_complete',
  Completed = 'completed'
}

export interface MaintenanceEvent extends BaseType, WithId {
  machineId?: Id;
  suggestedPriority?: number;
  priority: number;
  machineDescription?: string;
  owner: string; // TODO - eventually this will be a User object
  creator?: MaintenanceCreator;
  status: MaintenanceEventStatus;

  // dates
  scheduled?: Date;
  due?: Date; // todo: why do we need this date?
  suggestedDue?: Date;
  completion?: Date | string; // must accept string for toISO8061

  // close out survey details
  completedAsPlanned?: boolean;
  completionCycleCount?: number;
  duration?: string;
  comments?: string;
  followUpNeeded?: boolean;

  // joined in from the schedule
  maintenanceScheduleId?: Id;
  frequencyType?: MaintenanceFrequencyType;
  frequency?: number;
  detailedInstructions?: string;
  estimatedCompletionTime?: number; // Comes as seconds
  subcomponent?: string;
  description?: string;

  // relationships
  tasks?: MaintenanceTask[];
  purchasables?: PMPurchasable[];

  predictiveAlert?: DataScienceSurvey; // remove
  createdAt?: Date;

  closedRunMetric?: string;
  showToCustomer?: boolean;
}

export interface MaintenanceEventGroup extends BaseType {
  value: number;
  runMetric: MaintenanceFrequencyType;
}
export interface MaintenanceTask extends BaseType {
  action: string;
  maintenanceEventId: string;
  priority: number;
  status: MaintenanceTaskStatus;
  type: MaintenanceTaskType;
  pmSurvey?: MaintenanceTaskSurvey;
  description?: string;
}

export interface PMPurchasable extends BaseType {
  maintenanceEventId: string;
  purchasableId: string;
  quantity: number;
}

export interface MaintenanceEventArgs extends Paginated, Sortable {
  maintenanceEventIds?: Id[];
  machineIds?: Id[];
  scheduleIds?: Id[];
  dateBefore?: string;
  dateAfter?: string;
  status?: MaintenanceEventStatus;
  owner?: string;
  includeTasks?: boolean;
  includeProductIds?: boolean;
  creator?: MaintenanceCreator;
  frequencyType?: MaintenanceFrequencyType[];
  subcomponents?: string[];
  requireParts?: boolean;
  includeGroups?: boolean;
  withoutPagination?: boolean;
  eventGroups?: string[];
}

export interface DataScienceSurveyArgs {
  maintenanceEventIds?: Id[];
  machineIds?: Id[];
  scheduleIds?: Id[];
  surveyIds?: Id[];
}

export interface MaintenanceEventTableRow extends MaintenanceEvent {
  nextStep: string; // TODO - change to use enum
}

export interface MaintenanceScheduleTableRow extends MaintenanceSchedule {
  nextStep: string;
}

export interface MaintenanceScheduleTableRow extends MaintenanceSchedule {
  nextStep: string;
}

/*
 * Data Science Survey
 */
export enum DataScienceIssueType {
  MECHANICAL = 'Mechanical',
  SENSOR = 'Sensor',
  NO_ISSUE = 'No Issue',
  IGNORED = 'Ignored'
}

export enum DataScienceSurveyIgnoreReasons {
  TOO_MANY = 'Too Many Alert Notifications',
  NOT_USEFUL = 'Alert Notifications Not Useful',
  OTHER = 'Other'
}

export enum PredictiveAlertConfirmation {
  Confirmed = 'confirmed',
  NoIssue = 'no_issue',
  None = 'none'
}

export interface DataScienceSurvey extends BaseType {
  maintenance_event_id: Id;
  issueType: DataScienceIssueType;
  detail: string;
  needFollowUp: boolean;
  ignoreReason: DataScienceSurveyIgnoreReasons;
  other: string;
}

export enum HelpEmailRequestType {
  SelectHelp = 'Select Help',
  OrderHelp = 'Order Help',
  GeneralHelp = 'General Help',
  PartIdentification = 'Part Identification',
  ReportBug = 'Report Bug'
}

export interface HelpEmailArgs extends BaseType {
  requestType: HelpEmailRequestType;
  customerEmail: string;
  buID: number;
  message: string;
  image?: ImageInput;
}

export interface ImageInput extends BaseType {
  image: FormData | null;
}

// Maintenance Schedules

export enum MaintenanceScheduleSortOrder {
  Ascending = 'ASC',
  Descending = 'DESC'
}

export interface MaintenanceScheduleArgs extends Paginated, Sortable {
  maintenanceScheduleIds?: Id[];
  machineIds?: Id[];
  scheduleInternalIds?: Id[];
  minimumFrequency?: number;
  maximumFrequency?: number;
  frequencyType?: MaintenanceFrequencyType;
  creator?: MaintenanceCreator;
  subcomponents?: string[];
  sortBy?: string;
  sortDirection?: MaintenanceScheduleSortOrder;
  requireParts?: boolean;
  eventGroups?: string[];
}

export interface MaintenanceSchedule extends BaseType, WithId {
  internalId: string;
  description: string;
  frequency?: number;
  frequencyType?: MaintenanceFrequencyType;
  detailedInstructions?: string[];
  priority: number;
  machineId: Id;
  subcomponent?: string;
  creator: MaintenanceCreator;
  createdAt?: Date;
  recentlyCompleted?: boolean;
  showToCustomer?: boolean;
}

export interface MachineCurrentRunMetric extends BaseType, WithId {
  machineId: Id;
  runMetricValue: number;
  runMetricLabel: MaintenanceFrequencyType;
}
export interface MachineCurrentRunMetricArgs extends BaseType {
  machineUuids: string[];
}

export interface MaintenceScheduleImportRow extends BaseType, WithId {
  rowId?: number;
  hasError?: boolean;
  businessUnitName?: string | null;
  salesforceMachineId?: string | null;
  machineName?: string | null;
  uniqueId?: string | null;
  pmId?: string | null;
  description?: string | null;
  scheduleSubcomponent?: string | null;
  frequency?: number | null;
  frequencyType?: MaintenanceFrequencyType | null;
  priority?: string | null;
  estimatedCompletionTime?: string | null;
  detailedInstructions?: string | null;
  skus?: string[] | null;
  quantities?: number[] | null;
  scheduleCreator?: MaintenanceCreator | null;
  errorMessage?: string | null;
  errorMessages?: MaintenceScheduleImportRowErrorData[];
}
export interface MaintenceScheduleImportRowErrorData {
  columnName: string;
  hasError: boolean;
  errorMessage: string;
  errors: string[];
}
export interface MaintenanceEventDownloadLink {
  url: string;
}
export interface MaintenanceEventDownloadPayload extends BaseType {
  machineIds?: string[];
  maintenanceScheduleIds?: string[];
  minimumFrequency?: number;
  maximumFrequency?: number;
}

export type UploadMaintenanceScheduleResponse = MaintenceScheduleImportRow[] | string[];
