import React from 'react';
import { ResetIcon } from 'icons/resetbtn';
import { DateButtonWithDropdown } from 'components/StyledUi/DateRange/DateButtonWithDropdown/DateButtonWithDropdown';
import { useDateRange } from 'components';

export const DatepickerBar = (): JSX.Element => {
  const { dateRange, setDateRange } = useDateRange();

  const resetButton = (
    <button
      className="live-graph-reset-button"
      onClick={(e) => console.log('resets to latest default date', e)}
    >
      <ResetIcon /> Reset{' '}
    </button>
  );

  return (
    <>
      {resetButton}
      <p>Timeframe</p>
      <DateButtonWithDropdown {...{ dateRange, setDateRange, hasGoBackDateLimit: 30 }} />
    </>
  );
};
