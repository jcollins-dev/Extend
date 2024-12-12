import { DateRangeProps } from '../DateRange.types';
import { DateButtonWithDropdownContainerProps } from './DateButtonWithDropdown.elements';
import { DateRangeContainerProps } from '../DateRangeButton/DateRangeButton.types';

export interface DateButtonWithDropdownProps
  extends DateButtonWithDropdownContainerProps,
    DateRangeContainerProps {
  dateRange: DateRangeProps;
  setDateRange: (range: DateRangeProps) => void;
  placeholder?: boolean;
  hasGoBackDateLimit?: number;
}
