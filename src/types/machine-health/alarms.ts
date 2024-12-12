/**
 * Alarms
 */
import { BaseType } from 'types/index';

export enum AlarmType {
  Alarm = 'Alarm',
  // TODO: Consider removing spaces from CriticalAlarm and WarningInformation values
  CriticalAlarm = 'Critical Alarm',
  WarningInformation = 'Warning Information',
  AvureProductAlarmOld = 'Product Alarm',
  AvureProductAlarm = 'B-Alarm',
  AvureCriticalAlarmOld = 'Critical',
  AvureCriticalAlarm = 'A-Alarm',
  AvureWarningAlarmOld = 'Warning',
  AvureWarningAlarm = 'C-Alarm',
  AsepticFoilAlarm = 'Foil',
  AsepticInfeedModule = 'Infeed module',
  AsepticSealing = 'Sealing',
  Undefined = 'Undefined'
}

export enum AlarmLocation {
  CLE = 'CLE',
  PP = 'PP',
  PM = 'PM',
  Hidden = 'Hidden'
}

export interface Alarm extends BaseType {
  code: string;
  startTimestamp: string;
  endTimestamp: string;
  type: AlarmType;
  location: string;
  description?: string;
}

export interface DSIAlarm extends BaseType {
  timestamp: string;
  machine_id: string;
  log_type: string;
  sender_id: string;
  message: string;
}

export interface AlarmSummary extends BaseType {
  code: string;
  //type: AlarmType;
  description?: string;
  totalTime: number;
  count: number;
}

export interface ConfiguredAlarm extends BaseType {
  category: string;
  id: number;
  locationGroup: string;
  text: string;
}
