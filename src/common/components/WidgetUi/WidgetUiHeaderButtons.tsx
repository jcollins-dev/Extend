import React from 'react';

import { useDateRange } from 'components';
import { DateButtonWithDropdown } from 'components';
import { TooltipWrapper } from 'components';
import { IcoGear } from 'icons/IcoGear';
import { HeaderButtonContainer } from './WidgetUiHeaderButtons.elements';

export interface WidgetUiHeaderButtonsProps {
  type?: string;
}

export const WidgetUiHeaderButtons = ({ type }: WidgetUiHeaderButtonsProps): JSX.Element => {
  switch (type) {
    case 'calendar': {
      const { dateRange, setDateRange } = useDateRange();
      return (
        <TooltipWrapper Tooltip="Dates">
          <DateButtonWithDropdown {...{ dateRange, setDateRange }} iconOnly />
        </TooltipWrapper>
      );
    }

    case 'settings': {
      return (
        <TooltipWrapper Tooltip="Widget Settings">
          <HeaderButtonContainer type="button">
            <IcoGear />
          </HeaderButtonContainer>
        </TooltipWrapper>
      );
    }

    default: {
      return <div>error: type {type} not found</div>;
    }
  }
};
