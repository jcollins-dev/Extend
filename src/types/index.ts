import { ExpandableConfig, GetComponentProps, AlignType } from 'rc-table/lib/interface';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { StyledComponent, DefaultTheme } from 'styled-components';
import { colors, typography } from 'themes';
import { PublicClientApplication } from '@azure/msal-browser';
import React from 'react';
import { Part } from './parts';
import { MaintenanceEventGroup } from './maintenance';
import { PermissionScope, PermissionScopeName } from 'types/user-management';

//enums
export enum MachineStatus {
  Offline = 'offline',
  AtRisk = 'at-risk',
  Healthy = 'healthy'
}
export enum SortState {
  none,
  unsorted,
  ascending,
  descending
}
export enum ResourceType {
  Image = 'image',
  MarkedImage = 'imageWithMarkers',
  PDF = 'PDF',
  Rendering = 'rendering',
  None = 'none',
  // The three below are from the new Asset model on
  // on the backend. TODO - reconcile Resource and Asset
  Icon = 'icon',
  ProductImage = 'product_image',
  Manual = 'manual',
  LineImage = 'line_image',
  MachineImage = 'machine_image'
}

export enum TabShape {
  SQUARE
}
export enum DependentAxisFormat {
  PERCENTAGE = 'PERCENTAGE',
  TIME = 'TIME'
}
export enum PMOpenType {
  CLOSEOUT_SURVEY_TYPE = 'survey',
  PARTS_TYPE = 'parts',
  ASSIGN_AND_SCHEDULE = 'assign_schedule',
  FOLLOW_UP = 'followup',
  NONE = ''
}
export enum ModalSize {
  XXSMALL = 'xxsmall',
  XSMALL = 'xsmall',
  SMALL = 'small',
  SM = 'sm',
  MEDIUM = 'medium',
  LARGE = 'large',
  SMALL_AUTO_HEIGHT = 'small_auto_height',
  XSMALL_AUTO_HEIGHT = 'xsmall_auto_height',
  XXSMALL_AUTO_HEIGHT = 'xxsmall_auto_height'
}
export enum Role {
  Admin = 'admin',
  User = 'user'
}
export enum UserScopes {
  Read = 'read',
  Write = 'write',
  Buyer = 'buyer'
}
export enum MachineStatus {
  OFFLINE = 'offline',
  AT_RISK = 'at-risk',
  HEALTHY = 'healthy'
}

// Common types
export type DateTuple = [Date, Date];

export type NumberTuple = [number, number];

export type ZoomObjectTuples = {
  x?: DateTuple | undefined;
  y?: NumberTuple | undefined;
};
export type SortClickHandler = (key: string, currentSortState: SortState) => void;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type SelectEvent = React.ChangeEvent<HTMLSelectElement>;

export type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

export type InputChangeHandlerWithIndex = (
  event: React.ChangeEvent<HTMLInputElement>,
  id: string
) => void;

export type SelectChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => void;

export type TextAreaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type MsalInstanceProps = {
  instance: PublicClientApplication;
};
export type Id = string;
export type WithId = { id: Id };
export type WithName = { name: string };
export type WithOptionalName = { name?: string };
export type WithParent = { parentId: Id };
export type WithQuantity = { quantity: number };
export type Paginated = { limit?: number; offset?: number };
export type Sortable = { sortBy?: string; sortDirection?: 'ASC' | 'DESC' };
export type BaseType = Record<string, unknown>;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type ModalSizeType =
  | 'small'
  | 'sm'
  | 'medium'
  | 'large'
  | 'xsmall'
  | 'xxsmall'
  | 'xxsmall_auto_height'
  | 'xsmall_auto_height'
  | 'small_auto_height';
export type MachineBusinessUnit = 'avure' | 'pna' | 'aseptic' | 'pemea' | 'dsi' | 'proseal';

//interfaces
export interface IconSpec {
  iconElement: IconDefinition | ((color?: string) => JSX.Element);
  iconType: 'fa' | 'custom';
}
export interface InputVariant {
  variant?: 'gray' | 'white' | 'disabled' | 'white-dark';
  borderVariant?: 'none' | 'error';
}
export interface IconSpec {
  iconElement: IconDefinition | ((color?: string) => JSX.Element);
  iconType: 'fa' | 'custom';
}
export interface BusinessUnit extends BaseType {
  id: number;
  name: string;
  partsDeskEmail?: string;
  displayName?: string;
  phoneNumber?: string;
  ambassadorEmail?: string;
  serviceEmail?: string;
  salesforceEnabled?: boolean;
  emailEnabled?: boolean;
}
export interface Machine extends BaseType, WithId, WithName {
  description: string;
  sku: string;
  plantId: Id; // link to plant
  orgId: Id; // link to organization (company)
  lineId?: Id; // link to line
  status: MachineStatus;
  purchased: Date;
  installed: Date;
  warrantyExpired: Date;
  nickname: string;
  assets?: null | Resource[];
  throughput?: string[];
  lineSpeed?: string[];
  downtime?: string[];
  businessUnit: MachineBusinessUnit | number | undefined;
  parts?: Part[];
  timezone?: string;
  hasParts?: boolean;
  serialNumber: string;
}
export interface Line extends BaseType, WithId {
  name: string;
  plantId: string;
}
export enum DigitalEdgeType {
  KDM = 'KDM',
  DSDM = 'DSDM',
  MQTT = 'MQTT'
}
export interface MachinesArgs extends BaseType {
  uuids?: string[];
  includeResources?: boolean;
  plantIds?: string[];
}
export interface LinesArgs extends BaseType {
  plantIds?: string[];
}

export interface Language extends BaseType, WithId {
  name?: string;
}

export interface Component extends BaseType, WithId, WithParent, WithQuantity {}
/**
 * Contact types
 **/
export interface ContactItem {
  contactType?: string;
  value: string;
}
export interface ContactGroup {
  name?: string;
  contactItems: ContactItem[];
}
export interface PlantBuContacts {
  plantName?: string;
  buName?: string;
  contactDetails: ContactDetails[];
}
export interface ContactDetails {
  name: string | undefined;
  contactItems: ContactItem[];
}
/**
 * PM
 */
export interface PMTask extends BaseType {
  id: number;
  machineId: Id;
  subComponent: string;
  description: string;
  serialNumber: string;
  subDescription: string;
  priority?: 'high' | 'medium';
  assigned?: {
    name: string;
  };
}
export interface PM extends BaseType {
  id: number;
  type: 'date' | 'runtime' | 'cycle-count';
  date?: Date;
  runtime?: number;
  cycleCount?: number;
  tasks: PMTask[];
}

export interface PMTaskWithKey extends PMTask {
  key: string;
}
export interface SidenavItemProps {
  id: number;
  icon?: IconSpec;
  label: NavFlyoutType;
  name?: PermissionScopeName;
  link?: string;
  subItems?: SidenavItemProps[];
  isSubItem?: boolean;
  isLast?: boolean;
  isExpanded?: boolean;
  setExpanded?: (isExpanded: boolean) => void;
  currentOpenSubMenu?: number;
  toggleSubMenu?: (id: number) => void;
  clickOverride?: CallableFunction;
  authorisedGroups?: Role[];
  visible?: boolean;
  useFleetMenu?: boolean;
  toggleContent?: boolean;
  fleetLinks?: {
    org?: string | null;
    plant?: string | null;
    line?: string | null;
    machine?: string | null;
  };
}

export enum NavFlyoutType {
  Fleet = 'fleet',
  Maintenance = 'card_maintenance_manager',
  Parts = 'card_parts_shop',
  MachineManagement = 'machine_management',
  UserManagement = 'card_group_user_management',
  Help = 'help',
  ServiceDashboard = 'service_dashboard',
  ServiceEvents = 'service_events',
  RoutineMaintenance = 'routine_events',
  ManualsAndGuides = 'manuals_and_guides',
  Catalog = 'catalog',
  Orders = 'orders',
  Settings = 'settings',
  Reports = 'reports',
  DemoTable = 'demo_table'
}
export interface FAQCategories {
  category: string;
  faqs: FAQItemProps[];
  icon?: string;
}
export interface FAQItemProps {
  question: string;
  answers: string[];
  subanswers: string[];
}

/**
 * Graph types
 **/
export interface BarSeriesCardProps {
  title: string;
  data: ThresholdBarGraphProps;
}
export interface ThresholdBarGraphProps {
  barData: Array<ReadingBarData>;
  // horizontal threhsold to display
  threshold: number;
  goodAboveThreshold?: boolean;
  height: number;
  width: number;
  dependentAxisFormat?: DependentAxisFormat;
}
export interface TrendlineGraphProps {
  kpi: string;
  graphData: Array<ReadingBarData>;
  // horizontal threhsold to display
  threshold: number;
}
export interface ReadingBarData {
  reading: number;
  date: string;
}
export interface VictoryScale {
  x: (x: unknown) => number;
  y: (y: unknown) => number;
}
export interface MachineProps {
  machine: Machine;
}
export interface HeaderProps {
  title: string;
  subtitle?: string;
}
export interface SortableHeaderProps {
  key: string;
  title: string | JSX.Element;
  subtitle?: string;
  sortState?: SortState;
  clickHandler?: SortClickHandler;
}
export interface ColumnConfig {
  title: string | JSX.Element;
  subtitle?: string;
  colSpan?: number;
  dataIndex?: string;
  key?: string;
  width?: number | string;
  render?: (
    value: boolean | string | number | JSX.Element,
    record?: unknown,
    index?: number
  ) => JSX.Element | React.ReactNode;
  sortState?: SortState;
  align?: AlignType;
  customHeader?: JSX.Element;
  fixed?: 'right' | 'left' | boolean;
  difference?: string;
  children?: ColumnConfigChildren[];
  hide?: boolean;
}

export interface SubheaderColumnConfig {
  title: string;
  children?: ColumnConfigChildren[];
  dataIndex?: string;
  key?: string;
}

interface ColumnConfigChildren {
  title: string | JSX.Element;
  subtitle?: string;
  colSpan?: number;
  dataIndex: string;
  key: string;
  width?: number | string;
  render?: (
    value: boolean | string | number | JSX.Element,
    record?: unknown,
    index?: number
  ) => JSX.Element | React.ReactNode;
  sortState?: SortState;
  align?: AlignType;
  customHeader?: JSX.Element;
  fixed?: 'right' | 'left' | boolean;
  difference?: string;
}
interface TableScrollType {
  x?: number | true | string;
  y?: number | string;
}
export interface TableProps {
  columnConfigs: ColumnConfig[];
  sortHandler?: SortClickHandler;
  title?: string;
  titleIcon?: IconDefinition;
  rowKey?: string | ((record: BaseType, index?: number) => string);
  alternatingRowColoring?: boolean;
  bodyRowComponent?: StyledComponent<'tr', DefaultTheme, BaseType, never>;
  customHeader?: StyledComponent<'thead', DefaultTheme, BaseType, never>;
  isDataLoading?: boolean;
  borderBottomRow?: boolean;
  headerBgColor?: string;
  scroll?: TableScrollType;
  hideScroll?: boolean;
  outerBorderColor?: string;
  borderRadius?: string;
  showHeader?: boolean;
  cellPadding?: string;
  renderCustomEmptyText?: () => JSX.Element | React.ReactNode;
  renderCustomFooter?: () => JSX.Element | React.ReactNode;
  className?: string;
  id?: string;
}
export interface BaseTableProps<T extends BaseType> extends TableProps {
  // TODO: increase type specificity
  data: T[];
  expandable?: ExpandableConfig<T>;
  onRow?: GetComponentProps<T>;
  gridArea?: string;
  headerSticky?: boolean;
  verticalAlign?: 'baseline' | 'bottom' | 'middle';
}

// TODO - update to support multi filters on the same property (???)
export interface Filter {
  property: string;
  value: string | number | undefined;
}
export interface PartCategory extends BaseType {
  id: number | string;
  name: string;
  description?: string;
  serialNumber: string;
  img?: string;
}

// Organization types and interfaces
export interface Organization extends WithId, WithName {
  // Maybe plants should just be ids instead of whole plants
  plants: Plant[];
}
export interface Plant extends WithId, WithName {
  orgId: Id;
  customer: string;
  // Should this be a list of ids instead of a list of machines?
  machines: Machine[];
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countryCode: string;
  countryName: string;
  state: string;
  zipCode: string;
  siteName: string;
}

// TODO: Remove SF naming convention once Extend Order Mgmt is removed
export interface SFOrder extends BaseType, WithId, WithName {
  createdDate: Date;
  poNumber: string;
  status: string;
  total: number;
  quantity: number;
  orderQuoteId?: string;
}
export interface SFOrderHistory extends BaseType, WithId, WithName {
  poDate?: string;
  poNumber?: string;
  orderBy?: string;
  poStatus?: string;
  totalPrice?: number;
  creator?: string;
  linkToPdfInBlobStorage?: string;
  machineInfo?: SFMachineInfo[];
  poDetails?: SFOrderItem[];
  shippingAddress?: string;
  billingAddress?: string;
  vendorAddress?: string;
}
export interface SFOrderItem extends BaseType, WithId, WithName {
  description?: string;
  partNumber?: string;
  productId?: string;
  quantity?: number;
  subtotal?: number;
  unitOfMeasurement?: string;
  unitPrice?: string;
  machineId?: string;
  machineName?: string;
  currency?: string;
  currencySymbol?: string;
  machineInfo?: OrderMachineInfo[];
}
export interface OrderMachineInfo {
  machineId?: string;
  machineName?: string;
  machineType?: string;
  machineStatus?: string;
  serialNumber?: string;
}
export interface OrdersByMachineId extends BaseType {
  machineId: string;
  limit: number;
  offset: number;
}
export interface MachineInfo {
  serialNumber?: string;
  machineType?: string;
  machineStatus?: string;
  machineName: string;
  machineId: string;
}
export interface OrderDetails {
  totalRecords: number;
  orderDetails: SFOrder[];
}
export interface OrderedMachineList {
  machineList: MachineInfo[];
}
export interface SFMachineInfo {
  serialNumber: string;
  machineType: string;
  machineStatus: string;
}
// User types and interfaces
export interface User extends WithId {
  firstName: string;
  lastName: string;
  email: string;
  sfUserId: string;
  sfUserName: string;
  organizations: string[];
  plants: string[];
  machines: string[];
  scopes: UserScopes[];
  preferences: BaseType;
  allOrganizations: boolean;
  allMachines: boolean;
  allPlants: boolean;
  textAlert?: boolean;
  emailAlert?: boolean;
  phone?: string;
  groupId?: string;
  enable_ap_permission?: boolean;
  permissions?: PermissionScope[];
}

export interface ReportAction extends Action {
  type: string;
  machineId: string;
}

export interface ReportValidation {
  machineId: string;
  isReportValid: boolean;
}

export interface HelpInfo {
  helpMessage: string | undefined;
}
export interface HelpAction extends Action {
  helpMessage: string;
}

// Redux types and interfaces
export interface Action {
  type: string;
}
export interface UserAction extends Action {
  // TODO - update type to be more specific to possible user actions
  type: string;
  user?: User;
}
export interface Bubble {
  id: Id;
  partUuid?: Id;
  partLabel?: string;
  index: string;
  x: number;
  y: number;
  radius: number;
  missingInBom?: boolean;
  bubbleEditId?: Id;
}
export interface BubbleWithMatchingEdit extends Bubble {
  matchesEdit: boolean;
}
export interface Resource extends BaseType, WithId, WithParent {
  type: ResourceType;
  url: string;
}

// Temporarily adding this and keeping Resource until
// we fully transition to Asset model on backend
export interface Asset extends BaseType, WithId {
  assetType: ResourceType;
  url: string;
}
export interface ImageResource extends Resource {
  width?: number;
  height?: number;
  markers?: null | Bubble[];
}
export interface ThresholdValueProps {
  value?: number;
  thresholdValue?: number;
}
export interface PreventativeMaintenancePart extends Part {
  quantity?: number;
  autoOrder?: boolean;
  selected?: boolean;
}
export interface MachineModalKpiData {
  id?: string;
  name: string;
  data: ReadingBarData[];
  units?: string;
  value?: string;
  threshold?: number;
  goodAboveThreshold?: boolean;
  dependentAxisFormat?: DependentAxisFormat;
}
export interface MachineModalData extends BaseType {
  id: number;
  kpis: MachineModalKpiData[];
}
export interface WizardFooterProps {
  nextText: string;
  prevText?: string;
  nextAction?: () => void;
  continueCondition?: () => boolean;
}
export interface SearchQuery extends BaseType, Paginated {
  query?: string;
  machineId?: string;
  startNodeSku?: string;
}
export interface PaginatedResults<Type> {
  items: Type[];
  limit: number;
  offset: number;
  total: number;
}
export interface PaginatedMaintenanceEventGroupResults<Type> extends PaginatedResults<Type> {
  eventGroups?: MaintenanceEventGroup[];
}
export interface B2CPolicies {
  names: {
    signUpSignIn: string;
    forgotPassword: string;
    editProfile: string;
  };
  authorities: {
    signUpSignIn: {
      authority: string;
    };
    forgotPassword: {
      authority: string;
    };
    editProfile: {
      authority: string;
    };
  };
  authorityDomain: string;
}
export interface FileUpload {
  file: File;
}
export interface MultipleFileUpload {
  files: File[];
}
export interface MachineAsset extends WithId, Asset {}

export interface MachineAssetArgs extends BaseType {
  machineId: string;
  assetType: ResourceType;
}
export interface LineViewAssetArgs extends BaseType {
  assetType: ResourceType;
  lineId: string;
}

export interface TableColumnConfigs extends BaseType {
  systemId?: string;
  batchNumber?: string;
  lotId?: string;
  batchSuccessful?: boolean;
  startTime?: string;
  endTime?: string;
  idealPressurizeTime?: string;
  deltaPressurizeTime?: string;
  cycleTime?: string;
  pressurizeTime?: string;
}

export interface MasterTagListArgs {
  id: string;
  name: string;
  digital_edge_type: null | string;
  description: string;
  business_unit_id: null | string;
  business_unit: {
    id: string;
    name: string;
  };
  machine_type_id: null | string;
  machine_type: {
    code: string;
    name: string;
  };
  machine_model_id: null | string;
  machine_model: {
    id: string;
    name: string;
  };
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: null | string;
  versions: number;
  selected: boolean;
}
