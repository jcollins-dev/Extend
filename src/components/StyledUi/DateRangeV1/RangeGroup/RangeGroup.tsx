import React, { useState, useEffect } from 'react';
import { DayGroupPickerProps } from './RangeGroup.types';
import moment from 'moment';

export const RangeGroup = ({
  dayRangeGroups,
  handleUpdate,
  hours
}: DayGroupPickerProps): JSX.Element => {
  const [selected, set] = useState<number | undefined>();

  const handleClick = (count: number) => set(count);

  useEffect(() => {
    if (selected) {
      handleUpdate({
        startTime:
          selected > 0
            ? hours
              ? moment().subtract(selected, 'h').toDate()
              : moment().startOf('days').subtract(selected, 'd').toDate()
            : moment().startOf('days').toDate(),
        endTime: moment().toDate()
      });
    }
  }, [selected]);

  const Ranges = Object.entries(dayRangeGroups).map(([label, count]) => (
    <button
      className={`${selected === count ? `day-group__item is-selected` : `day-group__item`}`}
      key={count}
      type="button"
      onClick={() => handleClick(Number(count))}
    >
      {label}
    </button>
  ));

  return <>{Ranges}</>;
};
