export interface DateRangeProps {
  startTime: Date;
  endTime: Date;
}

export interface DateRangePickerProps {
  dateRange: DateRangeProps;
  timezone?: string;
  toggleTimezone?: (x?: boolean) => void;
  handleSubmit: (range: DateRangeProps) => void;
  handleCancel: () => void;
  className?: string;
  hasGoBackDateLimit?: number;
}
