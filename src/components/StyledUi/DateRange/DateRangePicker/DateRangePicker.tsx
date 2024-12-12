import React, { useState, useEffect } from 'react';

import {
  DateRangePickerContainer,
  dateRangePickerBaseClass as baseClass
} from './DateRangePicker.elements';

import { TimeRangeInputs } from '../TimeInput/TimeRangeInputs';
import { StyledButtonV2 } from 'components/StyledUi/elements/StyledButton';
import { DateRangeProps } from '../';
import { Calendar } from '../Calendar/Calendar';
import { RangeSelectListPropsOptions } from '../RangeSelectList';

import { RangeSelectList } from '../RangeSelectList';

import {
  defaultRangeSelectListItems,
  defaultTimeRangeSelectListItems
} from '../RangeSelectList/defaultRangeSelectListItems';

export interface DateRangePickerSettingsProps {
  hideTimeInputs?: boolean;
  hideDateRangeSelect?: boolean;
  hideTimeRangeSelect?: boolean;
  hideCalendar?: boolean;
  hasFutureDates?: boolean;
}

export interface DateRangePickerProps extends DateRangePickerSettingsProps {
  dateRange: DateRangeProps;
  handleSubmit: (range: DateRangeProps) => void;
  handleCancel: () => void;
  className?: string;
  hasGoBackDateLimit?: number;
  dateRangeSelectListOptions?: RangeSelectListPropsOptions;
  hourRangeSelectListOptions?: RangeSelectListPropsOptions;
}

export const DateRangePicker = ({
  dateRange,
  handleSubmit,
  handleCancel,
  className,
  hasGoBackDateLimit,
  dateRangeSelectListOptions,
  hourRangeSelectListOptions,
  hideCalendar,
  hideDateRangeSelect,
  hideTimeInputs,
  hideTimeRangeSelect,
  hasFutureDates
}: DateRangePickerProps): JSX.Element => {
  const open = true;

  //const { dateRange, setDateRange } = useDateRange()
  const [newDateRange, setNewDateRange] = useState<DateRangeProps>();

  const dayRangeOptions = dateRangeSelectListOptions || defaultRangeSelectListItems;
  const hourRangeOptions = hourRangeSelectListOptions || defaultTimeRangeSelectListItems;

  useEffect(() => {
    setNewDateRange(dateRange);
  }, [dateRange]);

  if (!newDateRange) return <></>;

  const containerSettings = {
    className: className ? `${className} ${baseClass}` : baseClass,
    'data-hidden': !open ? 'true' : undefined
  };

  const calendarSettings = !hideCalendar && {
    dateRange: newDateRange,
    setDateRange: setNewDateRange,
    hasGoBackDateLimit,
    hasFutureDates
  };

  const dateRangeListSettings = !hideDateRangeSelect && {
    handleSelect: handleSubmit,
    options: dayRangeOptions,
    dateRange
  };

  const timeRangeSettings = !hideTimeRangeSelect && {
    dateRange: newDateRange,
    setDateRange: setNewDateRange
  };

  const timeRangeListSettings = !hideTimeInputs && {
    handleSelect: handleSubmit,
    options: hourRangeOptions,
    dateRange
  };

  let gridCols: string | undefined = undefined;
  let gridRows: string | undefined = undefined;
  let gridAreas: string | undefined = undefined;

  if (hideTimeInputs && hideDateRangeSelect && hideTimeRangeSelect) {
    gridCols = `1fr`;
    gridRows = `auto auto`;
    gridAreas = `"calendar" "btns"`;
  }

  return (
    <>
      <DateRangePickerContainer {...{ gridAreas, gridCols, gridRows, ...containerSettings }}>
        {calendarSettings && (
          <Calendar className={`${baseClass}__calendar`} {...calendarSettings} />
        )}

        {dateRangeListSettings && (
          <RangeSelectList
            className={`${baseClass}__date-range-select ${baseClass}__side-col`}
            {...dateRangeListSettings}
          />
        )}

        {timeRangeSettings && (
          <TimeRangeInputs className={`${baseClass}__time-range`} {...timeRangeSettings} />
        )}

        {timeRangeListSettings && (
          <RangeSelectList
            className={`${baseClass}__time-range-select ${baseClass}__side-col`}
            {...timeRangeListSettings}
          />
        )}

        <div className={`${baseClass}__btns`}>
          <StyledButtonV2 styleType="submit" onClick={() => handleSubmit(newDateRange)}>
            Submit
          </StyledButtonV2>
          <StyledButtonV2 styleType="cancel" onClick={() => handleCancel()}>
            Cancel
          </StyledButtonV2>
        </div>
      </DateRangePickerContainer>
    </>
  );
};
