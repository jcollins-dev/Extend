import { DateRangeProps } from '../DateRange.types';
import { DateButtonWithDropdownContainerProps } from './DateButtonWithDropdown.elements';
import { DateRangeContainerProps } from '../DateRangeButton/DateRangeButton.types';
import { DateRangePickerSettingsProps } from '../DateRangePicker/DateRangePicker';

export interface DateButtonWithDropdownProps
  extends DateButtonWithDropdownContainerProps,
    DateRangeContainerProps,
    DateRangePickerSettingsProps {
  dateRange: DateRangeProps;
  setDateRange: (range: DateRangeProps) => void;
  placeholder?: boolean;
  hasGoBackDateLimit?: number;
  hasFutureDates?: boolean;
  dateFormat?: 'date-only' | 'short' | 'long';
}
