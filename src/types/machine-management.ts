import { ReactElement } from 'react';
import { BaseType, Id, WithId, WithName, DigitalEdgeType } from 'types';
import { MaintenceScheduleImportRow } from 'types/maintenance';
import { Part } from './parts';

export interface SaveOnboardingMachine extends BaseType {
  id?: string;
  salesforceMachineId?: string;
  description?: string;
  customer?: string;
  accountId?: string;
  machineTypeId?: string;
  businessUnitId?: number;
  timezone?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  digitalEdgeType?: DigitalEdgeType;
}
export interface CreatePowerBiMachineData extends BaseType {
  machineId?: string;
  workspaceId?: string;
  reportId?: string;
  machineDescription?: string;
}
export enum MachineProgressType {
  NONE = 'None',
  INCOMPLETE = 'Incomplete',
  UPLOADING = 'Uploading',
  INPROGRESS = 'InProgress',
  DONE = 'Done'
}
export interface MasterTagListColumn {
  name: string;
  dataType: string;
  required: boolean;
}
export enum ScaledDataType {
  CHAR = 'Character',
  BYTE = 'Byte',
  SHORT = 'Short',
  WORD = 'Word',
  LONG = 'Long',
  DWORD = 'Dword',
  FLOAT = 'Float',
  DOUBLE = 'Double'
}
export enum ScalingOptions {
  NO = 'No',
  LINEAR = 'Linear'
}
export enum ScanRate {
  _100 = '100',
  _200 = '200',
  _500 = '500',
  _1000 = '1000',
  _2000 = '2000',
  _10000 = '10000',
  _100000 = '100000'
}
export enum DataType {
  STRING = 'String',
  BOOLEAN = 'Boolean',
  CHAR = 'Character',
  BYTE = 'Byte',
  SHORT = 'Short',
  WORD = 'Word',
  LONG = 'Long',
  DWORD = 'Dword',
  FLOAT = 'Float',
  DOUBLE = 'Double',
  BCD = 'BCD',
  LBCD = 'LBCD',
  DATE = 'Date',
  LLONG = 'Llong',
  QWORD = 'Qword',
  STRING_ARRAY = 'String Array',
  BOOLEAN_ARRAY = 'Boolean Array',
  CHAR_ARRAY = 'Char Array',
  BYTE_ARRAY = 'Byte Array',
  SHORT_ARRAY = 'Short Array',
  WORD_ARRAY = 'Word Array',
  LONG_ARRAY = 'Long Array',
  DWORD_ARRAY = 'Dword Array',
  FLOAT_ARRAY = 'Float Array',
  DOUBLE_ARRAY = 'Double Array',
  BCD_ARRAY = 'BCD Array',
  LBCD_ARRAY = 'LBCD Array',
  DATE_ARRAY = 'Date Array',
  LLONG_ARRAY = 'Llong Array',
  QWORD_ARRAY = 'Qword Array',
  INTEGER = 'Integer',
  TIME = 'Time',
  DATETIME = 'DateTime',
  SQL_BIGINT = 'SQL - bigint',
  SQL_BIT = 'SQL - bit',
  SQL_DECIMAL = 'SQL - decimal',
  SQL_INT = 'SQL - int',
  SQL_MONEY = 'SQL - money',
  SQL_NUMERIC = 'SQL - numeric',
  SQL_SMALLINT = 'SQL - smallint',
  SQL_SMALLMONEY = 'SQL - smallmoney',
  SQL_TINYINT = 'SQL - tinyint',
  SQL_FLOAT = 'SQL - float',
  SQL_REAL = 'SQL - real',
  SQL_DATE = 'SQL - date',
  SQL_DATETIME2 = 'SQL - datetime2',
  SQL_DATETIME = 'SQL - datetime',
  SQL_DATETIMEOFFSET = 'SQL - datetimeoffset',
  SQL_SMALLDATETIME = 'SQL - smalldatetime',
  SQL_TIME = 'SQL - time',
  SQL_CHAR = 'SQL - char',
  SQL_TEXT = 'SQL - text',
  SQL_VARCHAR = 'SQL - varchar',
  SQL_NCHAR = 'SQL - nchar',
  SQL_NTEXT = 'SQL - ntext',
  SQL_NVARCHAR = 'SQL - nvarchar',
  SQL_BINARY = 'SQL - binary',
  SQL_IMAGE = 'SQL - image',
  SQL_VARBINARY = 'SQL - varbinary',
  SQLITE_NULL = 'SQLITE - null',
  SQLITE_INTEGER = 'SQLITE - integer',
  SQLITE_REAL = 'SQLITE - real',
  SQLITE_TEXT = 'SQLITE - text',
  SQLITE_BLOB = 'SQLITE - blob'
}
export enum UsedBy {
  DATA_SCIENCE = 'Data Science',
  LIVE_DATA_TRENDS = 'Live-Data Trends',
  SUPERVISED = 'Supervised',
  OTHER = 'Other'
}
export enum BooleanTag {
  True = 'True',
  False = 'False'
}
export enum UnitOfMeasure {
  AMPERE = 'Ampere',
  ATMOSPHERE = 'Atmosphere',
  BAR = 'Bar',
  BIT = 'Bit',
  BYTE = 'Byte',
  CELSIUS = 'Celsius',
  CENTIMETER = 'Centimeter',
  COUNT = 'Count',
  CUBIC_FOOT = 'Cubic Foot',
  CUBIC_INCH = 'Cubic Inch',
  CUBIC_METER = 'Cubic Meter',
  CUBIC_YARD = 'Cubic Yard',
  CUP = 'Cup',
  DAY = 'Day',
  DECIBEL = 'Decibel',
  DEGREE = 'Degree',
  FAHRENHEIT = 'Fahrenheit',
  FLUID_OUNCE = 'Fluid Ounce',
  FOOT = 'Foot',
  FOOT_PER_MINUTE = 'foot per minute',
  FOOT_POUND = 'Foot pound',
  GALLON = 'Gallon',
  GRAIN = 'Grain',
  GRAM = 'Gram',
  HERTZ = 'Hertz',
  HORSEPOWER = 'Horsepower',
  HOUR = 'Hour',
  IMPERIAL_TON = 'Imperial Ton',
  INCH = 'Inch',
  INCH_OF_WATER = 'Inch of Water',
  INCH_PER_SECOND = 'Inch per second',
  KELVIN = 'Kelvin',
  KILOGRAM = 'Kilogram',
  KILOMETER = 'Kilometer',
  KILOMETER_PER_HOUR = 'kilometer per hour',
  KILOPASCAL = 'Kilopascal',
  KILOWATT = 'Kilowatt',
  KNOT = 'knot',
  LITER = 'Liter',
  LITER_PER_MINUTE = 'Liter per Minute',
  LUX = 'Lux',
  METER = 'Meter',
  METER_PER_MINUTE = 'Meter per minute',
  METER_PER_SECOND = 'meter per second',
  MICROSIEMENS_PER_CENTIMETER = 'Microsiemens per centimeter',
  MILE = 'Mile',
  MILES_PER_HOUR = 'miles per hour',
  MILLIAMPERE = 'Milliampere',
  MILLIVOLT = 'Millivolt',
  MILLIBAR = 'Millibar',
  MILLILITER = 'Milliliter',
  MILLIMETER = 'Millimeter',
  MINUTE = 'Minute',
  MM_OF_MERCURY = 'mm of Mercury',
  NEWTON_SECOND_PER_SQUARE_METER = 'Newton-second per Square Meter',
  NEWTON_METER = 'Newton meter',
  NEWTON = 'Newton',
  OUNCE = 'Ounce',
  PASCAL = 'Pascal',
  PASCAL_SECOND = 'Pascal second',
  PERCENTAGE = 'Percentage',
  PINT = 'Pint',
  POISE = 'Poise',
  POUND = 'Pound',
  POUNDS_PER_SQUARE_INCH = 'Pounds per Square Inch',
  QUART = 'Quart',
  RADIAN = 'Radian',
  RADIAN_PER_SECOND = 'Radian per Second',
  REVOLUTIONS_PER_MINUTE = 'Revolutions per minute',
  SECOND = 'Second',
  SLUG = 'Slug',
  SQUARE_CENTIMETER = 'Square Centimeter',
  SQUARE_FOOT = 'Square Foot',
  SQUARE_INCH = 'Square Inch',
  SQUARE_KILOMETER = 'Square Kilometer',
  SQUARE_METER = 'Square Meter',
  SQUARE_METER_PER_SECOND = 'Square Meter per Second',
  SQUARE_MILE = 'Square Mile',
  SQUARE_MILLIMETER = 'Square Millimeter',
  SQUARE_YARD = 'Square Yard',
  TABLESPOON = 'Tablespoon',
  TEASPOON = 'Teaspoon',
  TESLA = 'Tesla',
  TON = 'Ton',
  TORR = 'Torr',
  VOLT = 'Volt',
  WATT = 'Watt',
  YARD = 'Yard',
  YEAR = 'Year'
}

export interface Driver extends BaseType, WithId {
  name: string;
  id: string;
  port: number;
}

export interface DeviceType extends BaseType, WithId, WithName {
  driverId: string;
}

export interface MasterTagListHeader {
  id?: string;
  name: string;
  description: string;
  businessUnitId: string;
  machineTypeId: string;
  machineModelId: string;
  digitalEdgeType: string;
}
export interface MasterTagListAttribute extends BaseType {
  omnibluTagName: string;
  usedBy?: string;
  dataType: string;
  description?: string;
  unitOfMeasure?: string;
}
export interface WipMasterTagListAttribute {
  omnibluTagName?: string;
  usedBy?: string;
  dataType?: string;
  description?: string;
  unitOfMeasure?: string;
}
export interface MasterTagListAttributeMqtt extends MasterTagListAttribute {
  masterTagName?: string;
  topicName?: string;
}
export interface WipMasterTagListAttributeMqtt extends BaseType, WipMasterTagListAttribute {
  masterTagName?: string;
  topicName?: string;
  machineTagListAttributeMqttId?: string;
  machineTopicName?: string;
  machineTagName?: string;
}
export interface MasterTagListAttributeKdm extends MasterTagListAttribute {
  masterTagName?: string;
  changeThreshold?: string;
  scaling?: string;
  scaledDataType?: string;
  rawHigh?: string;
  rawLow?: string;
  scaledHigh?: string;
  scaledLow?: string;
  scanRate?: string;
  module?: string;
  function?: string;
}
export interface WipMasterTagListAttributeKdm extends BaseType, WipMasterTagListAttribute {
  masterTagName?: string;
  changeThreshold?: string;
  scaling?: string;
  scaledDataType?: string;
  rawHigh?: string;
  rawLow?: string;
  scaledHigh?: string;
  scaledLow?: string;
  scanRate?: string;
  module?: string;
  function?: string;
  scope?: string;
  machineTagName?: string;
  machineTagListKdmId?: string;
  machineTagListAttributeKdmId?: string;
}
export interface MasterTagListAttributeDsdm extends MasterTagListAttribute {
  sqlTableName?: string;
  sqlColumnName?: string;
  isPrimaryKey?: boolean;
}
export interface WipMasterTagListAttributeDsdm extends BaseType, WipMasterTagListAttribute {
  sqlTableName?: string;
  sqlColumnName?: string;
  isPrimaryKey?: boolean;
  machineSqlTable?: string;
  machineSqlColumn?: string;
  machineTagListAttributeDsdmId?: string;
}

export enum TagListRowStatus {
  Draft = 'Draft',
  Valid = 'Valid',
  Error = 'Error',
  Mapped = 'Mapped',
  Unmapped = 'Unmapped'
}

export interface TagListRowData {
  row: number;
  rowStatus: TagListRowStatus;
  data: MasterTagListAttributeDsdm | MasterTagListAttributeKdm | MasterTagListAttributeMqtt;
}
export interface WipTagListRowData {
  row: number;
  rowStatus: TagListRowStatus;
  imported?: boolean;
  errorMessage?: MtlAttrError[];
  data:
    | WipMasterTagListAttributeDsdm
    | WipMasterTagListAttributeKdm
    | WipMasterTagListAttributeMqtt;
}
export interface MasterTagListPayload extends BaseType {
  masterTagList?: MasterTagListHeader;
  versionComment?: string;
  masterTagListAttributeMqtt?: MasterTagListAttributeMqtt[];
  masterTagListAttributeKdm?: MasterTagListAttributeKdm[];
  masterTagListAttributeDsdm?: MasterTagListAttributeDsdm[];
}
export interface MasterTaglistMatchingTag extends BaseType {
  machineId: string;
  machineTagListIds: string[];
}
// MTL Attributes with error messages
export interface MtlAttrError extends BaseType {
  errorMessage: string;
  columnName: string;
}
export interface MtlAttrDsdmWithError extends WipMasterTagListAttributeDsdm {
  errorMessage?: MtlAttrError[];
  hasError: boolean;
}
export interface MtlAttrKdmWithError extends WipMasterTagListAttributeKdm {
  errorMessage?: MtlAttrError[];
  hasError: boolean;
}
export interface MtlAttrMqttWithError extends WipMasterTagListAttributeMqtt {
  errorMessage?: MtlAttrError[];
  hasError: boolean;
}
export interface WipTagListRowErrorData {
  row: number;
  rowStatus: TagListRowStatus;
  errorMessage?: MtlAttrError[];
}

export type UpdateRowValueFunc = (
  rowId: string | number | undefined,
  key: string,
  value: string | number | boolean | ReactElement
) => void;

export interface ReviewMachineMtlData extends BaseType {
  digitalEdgeType: DigitalEdgeType;
  dataKdm?: ReviewMachineMtlKdm[];
  dataDsdm?: ReviewMachineMtlDsdm[];
  dataMqtt?: ReviewMachineMtlMqtt[];
}

export interface ReviewMachineMtlQueryParams extends BaseType {
  machineId?: string;
}

export interface ReviewMachineMtlAttrsCommon extends BaseType {
  masterTagListAttrId?: string;
  machineTagListAttrId?: string;
  omnibluTagName?: string;
  masterDescription?: string;
  machineDescription?: string;
  masterDataType?: string;
  machineDataType?: string;
  unitOfMeasure?: string;
  usedBy?: string;
  rowId?: string;
  isValid?: boolean;
  isTouched?: boolean;
  isDuplicate?: boolean;
}

export interface ReviewMachineMtlCommon extends BaseType {
  machineTagListId: string;
  isValid?: boolean;
  isTouched?: boolean;
}
export interface ReviewMachineMtlKdm extends ReviewMachineMtlCommon {
  driverId: string;
  deviceTypeId: string;
  ipAddress: string;
  port: number;
  attributes: ReviewMachineMtlAttrsKdm[];
}

export interface ReviewMachineMtlAttrsKdm extends ReviewMachineMtlAttrsCommon {
  masterTagName?: string;
  plcTagName?: string;
  plcTagAddress?: string;
  scanRate?: string;
  machineScanRate?: string;
  changeThreshold?: number;
  machineChangeThreshold?: number;
  machineScaling?: string;
  machineScaledDataType?: string;
  machineRawHigh?: number;
  machineRawLow?: number;
  machineScaledHigh?: number;
  machineScaledLow?: number;
}

export interface ReviewMachineMtlDsdm extends ReviewMachineMtlCommon {
  databaseName: string;
  databaseIp: string;
  databasePort: number;
  databaseUsername: string;
  databasePassword: string;
  attributes: ReviewMachineMtlAttrsDsdm[];
}

export interface ReviewMachineMtlAttrsDsdm extends ReviewMachineMtlAttrsCommon {
  // Master
  masterTagName?: string;
  plcTagName?: string;
  sqlTableName?: string;
  sqlColumnName?: string;
  // Machine
  tableName?: string;
  indexColumn?: string;
  machineIsPrimaryKey?: boolean;
}

export interface ReviewMachineMtlMqtt extends ReviewMachineMtlCommon {
  attributes: ReviewMachineMtlAttrsMqtt[];
}

export interface ReviewMachineMtlAttrsMqtt extends ReviewMachineMtlAttrsCommon {
  masterTopicName?: string;
  plcTagName?: string;
  machineTopicName?: string;
  masterTagName?: string;
  machineTagName?: string;
}

export interface ReviewMachineMtlRequest extends BaseType {
  machineId: string;
  machineTagList?: ReviewMachineMtlKdmReq[] | ReviewMachineMtlDsdmReq[];
  machineTagListAttributes:
    | ReviewMachineMtlAttrsKdmReq[]
    | ReviewMachineMtlAttrsDsdmReq[]
    | ReviewMachineMtlAttrsMqttReq[];
}

export interface ReviewMachineMtlKdmReq extends BaseType {
  id: string;
  machineId: string;
  driverId: string;
  deviceTypeId: string;
  ipAddress: string;
  port: number;
}

export interface ReviewMachineMtlAttrsKdmReq extends BaseType {
  id: string;
  plcTagName: string;
  plcTagAddress: string;
  description: string;
  dataType: string;
  machineTagListKdmId: string;
  scanRate: number;
  changeThreshold: number;
  scaling: string;
  scaledDataType?: string;
  rawHigh?: number;
  rawLow?: number;
  scaledHigh?: number;
  scaledLow?: number;
}

export interface ReviewMachineMtlDsdmReq extends BaseType {
  id: string;
  machineId: string;
  databaseName: string;
  databaseIp: string;
  databasePort: number;
  databaseUsername: string;
  databasePassword: string;
}

export interface ReviewMachineMtlAttrsDsdmReq extends BaseType {
  id: string;
  tableName: string;
  indexColumn: string;
  description: string;
  dataType: string;
  isPrimaryKey: boolean;
  machineTagListDsdmId: string;
}

export interface ReviewMachineMtlAttrsMqttReq extends BaseType {
  id: string;
  topicName: string;
  tagName: string;
  description: string;
  machineTagListMqttId: string;
}

export interface ReviewMachinePlgTagNameValidCheck extends BaseType {
  isValid: boolean;
  errorMessage: string;
}

export interface OnboardingMachine extends BaseType, WithId {
  salesforceMachineId?: string;
  description?: string;
  customer?: string;
  accountId?: string;
  machineTypeId?: string;
  businessUnitId?: string;
  macId?: string;
  timezone?: string;
  street?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  diagrams?: MachineProgressType;
  tagList?: MachineProgressType;
  maintenanceSchedule?: MachineProgressType;
  provisionGateway?: MachineProgressType;
  kpiThreshold?: string;
  machineToMasterMapping?: boolean;
}

export interface OnboardingMachineParams {
  machineId: string;
}

export interface MachineOnboardingStatusInput extends BaseType {
  machineId?: string;
  diagramsStatus?: string;
  tagListStatus?: string;
  maintenanceScheduleStatus?: string;
  provisionGatewayStatus?: string;
  kpiThresholdStatus?: string;
}

export interface ProductsPartsUploadParams extends BaseType {
  machineId: string;
  skipHeader: boolean;
}

export interface PartsPhotoUploadParams extends BaseType {
  businessUnit: string;
}

export interface PartsPhotoUploadSuccess extends BaseType {
  name: string;
  path: string;
}

export interface PartsPhotoUploadError extends BaseType {
  name: string;
  reason: string;
  detail?: string;
}

export interface PartsPhotoUploadResponse extends BaseType {
  success: PartsPhotoUploadSuccess[];
  errors: PartsPhotoUploadError[];
}

export interface MachineOnboardingDiagramParams extends BaseType {
  machineId: string;
  salesforceMachineId: string;
  businessUnit: number;
}

export interface MachineOnboardingMaintenanceScheduleParams extends BaseType {
  skipHeader?: boolean;
  manufacturerSchedule?: boolean;
  maintenceScheduleImportRows?: MaintenceScheduleImportRow[];
  machineId: string;
}

export interface AccountSalesforce extends BaseType, WithId, WithName {}

export interface AccountSalesforceArgs extends BaseType {
  name?: string;
}

export interface AssetSalesforce extends BaseType, WithId, WithName {
  serialNumber?: string;
  description?: string;
  productDescription?: string;
  productEquipmentType?: string;
  businessUnit?: string;
  accountCity?: string;
  accountCountry?: string;
  accountPostalCode?: string;
  accountProvince?: string;
  accountStreet?: string;
  actualLocation?: string;
}

export interface AssetSalesforceArgs extends BaseType {
  accountId?: string;
}

export interface MachineType extends BaseType {
  code: string;
  name: string;
}

export interface PartHierarchyArgs extends BaseType {
  machineId?: string;
}

export interface PartNode extends BaseType, WithId {
  machineId?: string;
  sku?: string;
  description?: string;
  parentSku?: string;
  salesforceMachineId?: string;
  quantity?: string;
  children?: PartNode[];
  updatedAt?: string;
  editedSku?: string;
  hasBubble?: boolean;
}

export interface PartNodeExtension extends BaseType {
  sku?: string;
  partDescription?: string;
  customer?: string;
  buisnessUnit?: string;
  machine?: string;
  partId?: string;
  updatedAt?: string;
  editedSku?: string;
  parentSku?: string;
}

export interface PartUpdate {
  [id: Id]: string;
}

export interface DataQualityInImage extends BaseType {
  sku?: string;
  partDescription?: string;
  description?: string;
}

export interface BusinessUnit extends WithId {
  name: string;
}
export interface MachineModel extends WithId {
  name: string;
}
export interface MasterTagList extends BaseType, WithId {
  name: string;
  description?: string;
  digitalEdgeType?: DigitalEdgeType;
  businessUnit?: BusinessUnit;
  machineType?: MachineType;
  machineModel?: MachineModel;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  versions?: number;
  selected?: boolean;
}
export interface PartHierarchy extends BaseType {
  [s: string]: PartNode;
}

export interface CreateBubbleArgs extends BaseType {
  index: string;
  x: number;
  y: number;
  radius: number;
  resourceId: string;
  sku: string;
  parentSku: string;
  machineId: string;
}

export interface UpdateBubbleArgs extends BaseType, WithId {
  index: string;
  partSku: string;
  machineId: string;
  radius?: number;
}

// Diagram history interface
export type DiagramState = string[];
export type DiagramHistory = DiagramState[];

export interface DeleteMasterTagListVersionParams extends BaseType {
  masterTagListId: string;
  masterTagListVersionId?: string;
}
// MTL Version
export interface MasterTagListVersion extends WithId {
  version: number;
  description?: string;
  active?: boolean;
  masterTagListId: Id;
  createdAt?: Date;
  createdBy?: Id;
  updatedAt?: Date;
  updatedBy?: Id;
}

export enum MtlOption {
  Edit,
  Duplicate,
  Versions,
  Delete
}

export interface MasterTagListImportParams {
  digitalEdgeType: DigitalEdgeType;
  file: File;
  skipHeader?: boolean;
}

export interface MasterTagListVersionParams extends BaseType {
  masterTagListId: string;
  masterTagListVersionId?: string;
}

export interface MasterTagListWrapped extends BaseType {
  masterTagList?: MasterTagList;
  masterTagListVersion?: MasterTagListVersion;
  masterTagListAttributeMqtt?: MasterTagListAttributeMqtt[];
  masterTagListAttributeKdm?: MasterTagListAttributeKdm[];
  masterTagListAttributeDsdm?: MasterTagListAttributeDsdm[];
}

export interface MasterTagListMappingArgs extends BaseType {
  machineId?: string;
  tagName?: string;
  tableName?: string;
  indexColumn?: string;
  topicName?: string;
  includeManuallyMapped?: boolean;
}

export interface MachineTagListMappingArgs extends BaseType {
  machineId?: string;
  masterTagName?: string;
  sqlTableName?: string;
  sqlColumnName?: string;
  topicName?: string;
  includeManuallyMapped?: boolean;
}

export interface MasterTagListMappingPayload extends BaseType {
  machineId?: string;
  masterTagListIds?: string[];
}
export interface UpdateProvisionGatewayArgs extends BaseType {
  machineId: string;
  macId: string;
}

export interface KdmUnmappedMasterTagList extends BaseType, WithId {
  masterTagName: string;
  machineTagName?: string;
  omniBluTagName: string;
  description?: string;
  unitOfMeasure?: string;
  module?: string;
  function?: string;
  scope?: string;
  usedBy?: string;
  machineTagListKdmId?: string;
  machineTopicName?: string;
  machineSQLTable?: string;
  machineSQLColumn?: string;
  machineTagListMqttId?: string;
  machineTagListDsmId?: string;
  topicName?: string;
  sqlTableName?: string;
  sqlColumnName?: string;
  suggested?: boolean;
}
export interface BsmUnmappedMasterTagList extends BaseType, WithId {
  sqlTableName: string;
  sqlColumnName: string;
  omniBluTagName: string;
  description: string;
  dataType: string;
  isPrimaryKey?: string;
  unitOfMeasure: string;
  usedBy?: string;
}
export interface MqttUnmappedMasterTagList extends BaseType, WithId {
  id: string;
  topicName: string;
  masterTagName?: string;
  omniBluTagName: string;
  description: string;
  dataType: string;
  unitOfMeasure: string;
  usedBy: string;
}

export interface UnmappedMasterTagListType extends BaseType, WithId {
  digitalEdgeType: DigitalEdgeType;
  data: KdmUnmappedMasterTagList[];
}
export interface DeviceTypesArgs extends BaseType {
  driverId: string;
}

export interface ImportedMachineTagList extends BaseType, WithId {
  digitalEdgeType: string;
  data?: MachineTagListAttributeKDM[] | MachineTagListAttributeDSDM[];
}

export interface MachineTagListAttributeKDM extends BaseType, WithId {
  driverId: string;
  deviceTypeId: string;
  ipAddress: string;
  port: number;
}

export interface MachineTagListAttributeDSDM extends BaseType, WithId {
  databaseName: string;
  databaseIp: string;
  databasePort: number;
  databaseUsername: string;
  databasePassword: string;
}

export interface ImportMachineTagListParams extends BaseType {
  machineId: string;
  digitalEdgeType: string;
  data?: MachineTagListAttributeKDM | MachineTagListAttributeDSDM;
}

export interface UnmappedMachineTagList extends BaseType, WithId {
  digitalEdgeType: DigitalEdgeType;
  data?: KdmUnmappedMachineTagList[];
}

export interface KdmUnmappedMachineTagList extends BaseType, WithId {
  masterTagListAttributeKdmId: string;
  machineTagListKdmId: string;
  description?: string;
  plcTagAddress?: string;
  plcTagName?: string;
  tagName?: string;
  topicName?: string;
  tableName?: string;
  indexColumn?: string;
  machineTagListMqttId?: string;
  machinetagListDsdmId?: string;
  machinetagListAttributeDsdmId?: string;
  machinetagListAttributeMqttId?: string;
  masterTagName?: string;
  masterSqlTable?: string;
  masterSqlColumn?: string;
  masterMqttTopic?: string;
  masterMqttTag?: string;
  suggested?: boolean;
}

export interface MasterToMachineMappingPayload extends BaseType {
  machineId?: string;
  machineMasterMap?: unknown;
  customMasterTagListAttributeKdm?: WipMasterTagListAttributeKdm[];
  customMasterTagListAttributeDsdm?: WipMasterTagListAttributeDsdm[];
  customMasterTagListAttributeMqtt?: WipMasterTagListAttributeMqtt[];
}

export interface MachineMasterMap extends BaseType {
  masterTagListAttrId?: string;
  machineTagListAttrId?: string;
}

export interface MqttUnmappedMachineTagList extends BaseType, WithId {
  masterTagListAttributeMqttId: string;
  machineTagListMqttId: string;
  description?: string;
  topicName?: string;
  tagName?: string;
}
export interface MachineConfigParams extends BaseType {
  pushToGateway: boolean;
  machineId: string;
}

export interface MachineToMaster extends BaseType {
  [key: string]: string;
}

export interface DeleteMachineTagListParams extends BaseType {
  machineTagListId: string;
  digitalEdgeType: DigitalEdgeType;
}

export interface MachineToMasterMappingParams extends BaseType {
  machineId: string;
  machineToMasterMapping: boolean;
}
export interface EditedBubbleRecord extends BaseType, WithId {
  // Bubble page/screen coordinates
  x: number;
  y: number;
  // Values that help relate it to existing objects
  machineId: string;
  parentSku: string;
  // Values to help related but may not be provided
  // depending on data available between ingestions
  partId?: string;
  resourceId?: string;
  bubbleId?: string;
  // Values that can be updated
  oldIndex?: string;
  newIndex?: string;
  oldSku?: string;
  newSku?: string;
  // Other properties
  missingInBom: boolean;
  createdAt?: Date;
  createdBy?: string;
}

export enum Tabs {
  Machines,
  MasterTagList
}

export interface PreviousEditRecord extends EditedBubbleRecord {
  checked?: boolean;
  oldPartDesc?: string;
  newPartDesc?: string;
  assembly?: Part;
  radius: number;
  bubbleId?: Id;
}

export interface DeleteCustomMasterTagsParams extends BaseType {
  customTagIds: string[];
  machineId: string;
}
export type UpdateRowFn = (
  rowId: number | undefined,
  key: string,
  value: string | string[] | number[] | number | boolean | JSX.Element,
  columnName: string | undefined
) => void;
