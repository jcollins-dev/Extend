import { DateRangeProps } from "../DateRange.types"

export interface DayGroupItemsProps {
  [key: string]: number
}

export interface DayGroupPickerProps {
  dayRangeGroups: DayGroupItemsProps,
  handleUpdate: (range: DateRangeProps) => void,
  itemClassName?: string,
  hours?: boolean
}