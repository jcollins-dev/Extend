import React, { useState, useRef, RefObject } from 'react';
import { DateButtonWithDropdownContainer } from './DateButtonWithDropdown.elements';
import { DateButtonWithDropdownProps } from './DateButtonWithDropdown.types';
import { DateRangeButton } from '../DateRangeButton/DateRangeButton';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';
import { DateRangeProps } from '..';
import useClickOutside from 'hooks/useClickOutside';

const RefUser = (ref: RefObject<HTMLDivElement>, cb: (x?: boolean) => void) =>
  useClickOutside(ref, () => cb(false));

export const DateButtonWithDropdown = ({
  className,
  ga,
  dateRange,
  setDateRange,
  alignDropdown,
  iconOnly,
  placeholder,
  hasGoBackDateLimit
}: DateButtonWithDropdownProps): JSX.Element => {
  /** setting wrapping div css class */
  className = className ? `${className} ui-date-button-w-dropdown` : `ui-date-button-w-dropdown`;
  /** show/hide calendar dropdown */
  const [showCalendar, toggleCalendar] = useState(false);
  /** add custom class if calendar is open for extra styling */
  className = showCalendar ? `${className} is-open` : className;

  const buttonSettings = {
    handleClick: () => toggleCalendar(!showCalendar),
    iconOnly,
    placeholder
  };

  const rangePickerSettings = {
    handleSubmit: (range: DateRangeProps) => {
      setDateRange(range);
      toggleCalendar(false);
    },
    handleCancel: () => toggleCalendar(false),
    dateRange,
    hasGoBackDateLimit
  };

  const ref = useRef<HTMLDivElement>(null);

  if (ref) RefUser(ref, () => toggleCalendar(false));

  return (
    <DateButtonWithDropdownContainer {...{ className, ga, alignDropdown }} ref={ref}>
      <DateRangeButton {...buttonSettings} />
      {showCalendar && <DateRangePicker {...rangePickerSettings} />}
    </DateButtonWithDropdownContainer>
  );
};
