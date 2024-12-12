import React from 'react';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';

export interface TimeZoneTogglerProps extends StyledUiContainerProps {
  handle: () => void;
  selected: boolean;
}

export const TimeZoneToggler = ({
  handle,
  selected,
  className
}: TimeZoneTogglerProps): JSX.Element => {
  className = className ? `${className} time-range-inputs` : `time-range-inputs`;

  return (
    <label {...{ className }}>
      <input
        defaultChecked={selected ? true : false}
        type="checkbox"
        id="timeZoneToggler"
        onClick={() => handle()}
      />{' '}
      use 24 hours
    </label>
  );
};
