import React, { useState } from 'react';
import { Calendar } from '../Calendar/Calendar';
import { TimeInput } from '../TimeInput/TimeInput';
import { RangeGroup } from '../RangeGroup/RangeGroup';

import { DateRangeProps, DateRangePickerProps } from './DateRangePicker.types';
import { DateRangePickerContainer } from './DateRangePicker.elements';

import moment from 'moment';

const defaultDateRange: DateRangeProps = {
  startTime: moment().startOf('days').toDate(),
  endTime: moment().toDate()
};

interface DayRangeGroupsProps {
  [key: string]: number;
}

const dayRangeGroups: DayRangeGroupsProps = {
  ['Today']: -1,
  ['2 days']: 2,
  ['3 Days']: 3,
  ['5 Days']: 5,
  ['1 Week']: 7,
  ['2 weeks']: 14,
  ['30 days']: 30
};

const todayRangeGroups: DayRangeGroupsProps = {
  ['All Day']: -1,
  ['30 Minutes']: 0.5,
  ['1 Hour']: 1,
  ['2 Hours']: 2,
  ['4 Hours']: 4,
  ['8 Hours']: 8,
  ['12 Hours']: 12,
  ['24 Hours']: 24
};

interface ViewProps {
  today?: boolean;
  days?: boolean;
  range?: boolean;
}

export const DateRangePicker = ({
  dateRange,
  handleSubmit,
  handleCancel,
  className,
  timezone,
  toggleTimezone,
  hasGoBackDateLimit
}: DateRangePickerProps): JSX.Element => {
  /** setting wrapping div css class */
  className = className ? `${className} ui-date-range-picker` : `ui-date-range-picker`;

  const [newDateRange, setNewDateRange] = useState<DateRangeProps>(dateRange || defaultDateRange);

  const [view, setView] = useState<ViewProps>({ today: true });

  const startTimeSettings = {
    date: newDateRange.startTime,
    handleUpdate: (startTime: Date) =>
      setNewDateRange({
        ...newDateRange,
        startTime
      })
  };

  const endTimeSettings = {
    date: newDateRange.endTime,
    handleUpdate: (endTime: Date) =>
      setNewDateRange({
        ...newDateRange,
        endTime
      })
  };

  return (
    <DateRangePickerContainer {...{ className }}>
      <header className="ui-date-range-picker-header">
        <div className="ui-date-range-picker-header__title">
          <div>Show me:</div>
          {toggleTimezone && (
            <div className="ui-date-range-picker-header__options">
              use machine timezone{' '}
              <input
                type="checkbox"
                value={timezone ? 0 : 1}
                onChange={() => toggleTimezone(!timezone)}
                name="timezone"
              />
            </div>
          )}
        </div>
        <nav className="ui-date-range-picker-header__nav">
          <button
            type="button"
            className={
              view.today
                ? `ui-date-range-picker-header__nav-item is-current`
                : `ui-date-range-picker-header__nav-item`
            }
            onClick={() => setView({ today: true })}
          >
            Today
          </button>
          <button
            type="button"
            className={
              view.days
                ? `ui-date-range-picker-header__nav-item is-current`
                : `ui-date-range-picker-header__nav-item`
            }
            onClick={() => setView({ days: true })}
          >
            Days
          </button>
          <button
            type="button"
            className={
              view.range
                ? `ui-date-range-picker-header__nav-item is-current`
                : `ui-date-range-picker-header__nav-item`
            }
            onClick={() => setView({ range: true })}
          >
            Date Range
          </button>
        </nav>
      </header>

      <div className="ui-tabs">
        <div
          className={
            !view.today ? `ui-tab ui-tab__range-group is-hidden` : `ui-tab ui-tab__range-group`
          }
        >
          <RangeGroup
            {...{ hours: true, dayRangeGroups: todayRangeGroups, handleUpdate: setNewDateRange }}
          />
        </div>
        <div
          className={
            !view.days ? `ui-tab ui-tab__range-group is-hidden` : `ui-tab ui-tab__range-group`
          }
        >
          <RangeGroup {...{ dayRangeGroups, handleUpdate: setNewDateRange }} />
        </div>
        <div className={!view.range ? `ui-tab is-hidden` : `ui-tab`}>
          <Calendar {...{ dateRange, setDateRange: setNewDateRange, hasGoBackDateLimit }} />
        </div>
      </div>

      <div className="ui-dates">
        <div className="ui-date">
          <div className="ui-time-col">
            <div className="ui-time-col__header">Start Date</div>
            <div>{moment(newDateRange.startTime).format('l')}</div>
          </div>
          <div className="ui-time-col">
            <div className="ui-time-col__header">Time:</div>
            <TimeInput {...startTimeSettings} />
          </div>
        </div>
        <div className="ui-date">
          <div className="ui-time-col">
            <div className="ui-time-col__header">End Date</div>
            <div>{moment(newDateRange.endTime).format('l')}</div>
          </div>
          <div className="ui-time-col">
            <div className="ui-time-col__header">Time:</div>
            <TimeInput {...endTimeSettings} />
          </div>
        </div>
      </div>

      <div className="ui-buttons">
        <button type="button" className="ui-cancel" onClick={() => handleCancel()}>
          Cancel
        </button>
        <button
          type="button"
          className="ui-submit"
          onClick={() => handleSubmit && handleSubmit(newDateRange)}
        >
          Update Date Range
        </button>
      </div>
    </DateRangePickerContainer>
  );
};
