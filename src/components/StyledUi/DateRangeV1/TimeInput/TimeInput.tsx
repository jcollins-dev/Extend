import React, { useState } from 'react';
import { TimeInputProps } from './TimeInput.types';
import { TimeInputContainer } from './TimeInput.elements';
import moment from 'moment';
import { Icon } from 'components/StyledUi';

export const TimeInput = ({ date, handleUpdate, className }: TimeInputProps): JSX.Element => {
  className = className ? `${className} ui-time-input` : `ui-time-input`;

  const [showSelect, set] = useState(false);

  const curTime = moment(date).format('h:mm a');
  const items =
    // generate hours (24 hours)
    [...Array(24)].map((_, hh) =>
      // generate minutes (quarter hours)
      [...Array(4)].map((_, mm) => {
        // makes a new time object based on value
        const value = moment(date)
          .set('hours', hh)
          .set('minutes', mm * 15)
          .toDate();
        // gets current date and time
        const now = moment().toDate();
        // checks to see if option is available, if it's in the future, mute the item
        const inTheFuture = moment(value).isAfter(now);
        const newClass = inTheFuture ? 'time-dropdown__item is-disabled' : 'time-dropdown__item';
        // item click component
        return (
          <button
            className={newClass}
            type="button"
            key={`${hh}${mm}`}
            onClick={() => {
              !inTheFuture && handleUpdate(value);
              return !inTheFuture && set(false);
            }}
          >
            {moment(value).format('h:mm a')}
          </button>
        );
      })
    );

  return (
    <TimeInputContainer {...{ className }}>
      <button type="button" className="time-label-btn" onClick={() => set(!showSelect)}>
        {curTime} <Icon.ChevDown />
      </button>
      <div className={`${showSelect ? `time-dropdown` : `time-dropdown is-hidden`}`}>{items}</div>
    </TimeInputContainer>
  );
};
