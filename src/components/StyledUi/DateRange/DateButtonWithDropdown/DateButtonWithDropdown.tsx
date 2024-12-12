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
  hideIcon,
  placeholder,
  hasGoBackDateLimit,
  hideTimeInputs,
  hideDateRangeSelect,
  hideTimeRangeSelect,
  hideCalendar,
  dateFormat,
  hasFutureDates
}: DateButtonWithDropdownProps): JSX.Element => {
  /** setting wrapping div css class */
  className = className ? `${className} ui-date-button-w-dropdown` : `ui-date-button-w-dropdown`;

  if (iconOnly) className += ` icon-only`;
  if (hideIcon) className += ` icon-hidden`;
  /** show/hide calendar dropdown */
  const [showCalendar, toggleCalendar] = useState(false);

  /** add custom class if calendar is open for extra styling */
  className = showCalendar ? `${className} is-open` : className;

  /** change formatting of button if the time select options are hidden */
  if (hideTimeRangeSelect) dateFormat = dateFormat || 'date-only';

  const buttonSettings = {
    handleClick: () => toggleCalendar(!showCalendar),
    iconOnly,
    placeholder,
    dateFormat,
    dateRange
  };

  const rangePickerSettings = {
    handleSubmit: (range: DateRangeProps) => {
      setDateRange(range);
      toggleCalendar(false);
    },
    handleCancel: () => toggleCalendar(false),
    dateRange,
    hasGoBackDateLimit,
    hideTimeInputs,
    hideDateRangeSelect,
    hideTimeRangeSelect,
    hideCalendar,
    hasFutureDates
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