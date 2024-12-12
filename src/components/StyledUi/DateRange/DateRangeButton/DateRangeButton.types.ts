import { DateRangeProps } from '../';

export interface DateRangeContainerProps {
  align?: 'left' | 'right' | undefined;
  ga?: string;
  className?: string;
  iconOnly?: boolean;
  hideIcon?: boolean;
}

export interface DateRangeButtonProps extends DateRangeContainerProps {
  dateRange?: DateRangeProps;
  handleClick: () => void;
  dateFormat?: string;
  placeholder?: boolean;
}
