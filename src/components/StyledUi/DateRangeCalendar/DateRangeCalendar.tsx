import React, { useState, useCallback } from 'react';

import moment from 'moment';
import { Range, DateRangePicker as BaseDateRangePicker, StaticRange } from 'react-date-range';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { Styled, Types } from './';

// add custom classes to calendar for styling takeover
const customClasses = {
  dateRangePickerWrapper: 'ui-date-range',
  dateRangeWrapper: 'ui-date-range__calendar-wrapper',
  dateDisplayWrapper: 'ui-date-range__inputs',
  monthAndYearWrapper: 'ui-date-range__date-stepper',
  months: 'ui-date-range__calendar ui-calendar',
  month: 'ui-calendar__month',
  weekDays: 'ui-calendar__week-days',
  days: 'ui-calendar__days'
};

export const staticDateRanges = (dayRanges?: number[]): StaticRange[] => {
  const generateRange = (days: number) => (): Range => ({
    startDate: moment()
      .subtract(days - 1, 'days')
      .startOf('days')
      .toDate(),
    endDate: moment().endOf('days').toDate()
  });

  const isSelected = (range: Range, generatedRange: Range) => {
    const start = moment(range.startDate);
    const end = moment(range.endDate);
    return (
      start.isSame(generatedRange.startDate, 'day') && end.isSame(generatedRange.endDate, 'day')
    );
  };

  // use custom ranges if provided
  const ranges = dayRanges || [3, 7, 14, 30, 60, 90];

  return ranges.map((days) => ({
    label: `Last ${days} days`,
    range: generateRange(days),
    isSelected: (range: Range) => isSelected(range, generateRange(days)())
  }));
};

export const DateRangeCalendar = ({
  range,
  maxDate,
  minDate,
  handleUpdate,
  handleCancel,
  dayRanges,
  headline
}: Types.Props): JSX.Element => {
  const [dateRange, setDateRange] = useState<Range>({
    startDate: range?.from,
    endDate: range?.to
  });

  const updateDateRange = useCallback((range: Range) => {
    setDateRange(range);
    return true;
  }, []);

  return (
    <Styled.Container hasHeadline={headline ? true : false}>
      {headline && <Styled.Headline>{headline}</Styled.Headline>}
      <BaseDateRangePicker
        onChange={(item) => {
          const startDate = moment(item.range1.startDate).startOf('days').toDate();
          const endDate = moment(item.range1.endDate).endOf('days').toDate();
          updateDateRange({ startDate, endDate });
        }}
        months={2}
        ranges={[dateRange]}
        staticRanges={staticDateRanges(dayRanges)}
        inputRanges={[]}
        direction="horizontal"
        maxDate={maxDate}
        minDate={minDate}
        classNames={customClasses}
        moveRangeOnFirstSelection={false}
        /** default: `false` */
        retainEndDateOnFirstSelection={false}
      />

      <Styled.CalendarButton ga="btn-cancel" onClick={() => handleCancel()}>
        Cancel
      </Styled.CalendarButton>
      <Styled.CalendarButton
        ga="btn-submit"
        variant="primary"
        onClick={() => {
          handleUpdate &&
            handleUpdate({
              from: dateRange.startDate,
              to: dateRange.endDate
            });
          return handleCancel();
        }}
      >
        Apply
      </Styled.CalendarButton>
    </Styled.Container>
  );
};
