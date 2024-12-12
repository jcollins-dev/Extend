// Types
import {
  AlertConfigAlertLocation,
  AlertConfigType,
  AlertCriticality
} from 'types/machine-health/alerts';
import { AlertsTableDropdownItem, TagsDropdownItems } from 'types/machine-health/widget-table';

import { DateRangeProps } from 'components/StyledUi/DateRange';
import { OptionsOrGroups } from 'react-select';

export type TriggerRuleValue = keyof typeof AlertConfigType;
export type AlertLevel = keyof typeof AlertCriticality;
export type AlertLocation = keyof typeof AlertConfigAlertLocation;

export interface DropDownItem {
  label: string;
  value: string;
  isFixed?: boolean;
}

export interface GroupedOption {
  label: string;
  options: UserOption[];
}

export interface UserOption {
  value: string;
  label: string;
  color?: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}

export interface DropdownProps {
  disabled?: boolean;
  value: DropDownItem[];
  options: DropDownItem[];
  handleMultiSelect: (value: DropDownItem[]) => void;
  ariaLabel?: string;
  placeholder?: string;
  optionsWithHeaders?: OptionsOrGroups<DropDownItem, GroupedOption>;
  isCustomAddButton?: boolean;
  isCustomButtonHandle?: (value: DropDownItem[]) => void;
}

export interface Props {
  handeUpdateValue: (a: string, b: string) => void;
  value: string;
  hasClass?: string;
}

export interface OccurrenceProps {
  handeUpdateValue: (a: string, b: number) => void;
  value?: number;
  hasClass?: string;
}

export interface AlertLocationProps {
  handeUpdateValue: (a: string, b: string[]) => void;
  alertValue: string[];
  hasClass?: string;
}

export interface MachineStateProps {
  handeUpdateValue: (a: string, b: string[]) => void;
  machineValue: string[];
  hasClass?: string;
}

export interface DateProps {
  handeUpdateValue: (a: string, b: DateRangeProps) => void;
  value: DateRangeProps | null;
  hasClass?: string;
}

export interface TriggerFormatProps {
  handeUpdateValue: (a: string, b: string) => void;
  value?: string;
  hasClass?: string;
}

export interface TagDropdownProps {
  handeUpdateValue: (c: string, a: AlertsTableDropdownItem) => void;
  tagList?: TagsDropdownItems[];
  currentValue: AlertsTableDropdownItem | null;
  hasClass?: string;
  dropdownType?: string;
  label?: string;
}

export interface AlertProps {
  handleUpdateValue: (a: string, b: number | undefined) => void;
  uValue?: number;
  lValue?: number;
  hasClass?: string;
  value?: number;
  isDeviation?: boolean;
}

export interface AlertTriggerProps {
  handleUpdateValue: (a: string, b: number | undefined) => void;
  uRedValue?: number;
  lRedValue?: number;
  uOrangeValue?: number;
  lOrangeValue?: number;
  hasClass?: string;
}

export interface AlertNameProps {
  displayValue: string;
  handeUpdateValue: (type: string, value: string) => void;
  isValid?: boolean;
}

export interface AlertValidationConditionConfig {
  dataSource: boolean;
  triggerRule: boolean;
  triggerValueFormat: boolean;
  orangeAlertRangeUpper: boolean;
  orangeAlertRangeLower: boolean;
  orangeAlertDeviationFromMean: boolean;
  redAlertRangeUpper: boolean;
  redAlertRangeLower: boolean;
  redAlertDeviationFromMean: boolean;
  targetSetpoint: boolean;
  targetBoolean: boolean;
  booleanAlertColor: boolean;
  timeframeOfMeanCalculation: boolean;
}

export interface AlertValidationConfig {
  id: boolean;
  name: boolean;
  description: boolean;
  importance: boolean;
  location: boolean;
  machineState: boolean;

  active: boolean;

  conditions: Array<AlertValidationConditionConfig>;

  minimumOccurrences: boolean;
}

export interface StyledInputContainerProps {
  hasValidInput?: boolean;
  hasValidUpperInput?: boolean;
  hasValidLowerInput?: boolean;
}

export interface StyledButtonToTextProps {
  lang?: string;
}

export const CONDITION_VALIDATION_OBJECT = {
  dataSource: true,
  triggerRule: true,
  triggerValueFormat: true,
  orangeAlertRangeUpper: true,
  orangeAlertRangeLower: true,
  orangeAlertDeviationFromMean: true,
  redAlertRangeUpper: true,
  redAlertRangeLower: true,
  redAlertDeviationFromMean: true,
  targetSetpoint: true,
  targetBoolean: true,
  booleanAlertColor: true,
  timeframeOfMeanCalculation: true
};

export const VALIDATION_OBJECT = {
  id: true,
  name: true,
  description: true,
  importance: true,
  location: true,
  machineState: true,
  active: true,
  conditions: [{ ...CONDITION_VALIDATION_OBJECT }] as Array<AlertValidationConditionConfig>,
  minimumOccurrences: true
};
