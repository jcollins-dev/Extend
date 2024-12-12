import React, { ReactNode } from 'react';
import moment from 'moment';

import { WidgetUi, useDateRange, DateButtonWithDropdown } from 'components';

import { DatePickerWidgetProps } from 'components/StyledUi/widgets/DatePickerWidget';

import { DatePickerWidgetSubHeader } from 'components/StyledUi/widgets/DatePickerWidget';

interface Props extends DatePickerWidgetProps {
  children?: ReactNode | ReactNode[];
}

export const DatePickerWidget = ({ className, ...rest }: Props): JSX.Element => {
  const range = useDateRange();

  const { startTime, endTime } = range.dateRange;

  // setup widget ui
  const widgetUiSettings = {
    ...rest,
    SubTitle: (
      <DatePickerWidgetSubHeader>
        {moment(startTime).format('l LT')} <span className="spacer">to</span>{' '}
        {moment(endTime).format('l LT')}
      </DatePickerWidgetSubHeader>
    ),
    IconRight: { Icon: <DateButtonWithDropdown {...range} iconOnly />, label: 'select date range' },
    // add class modifiers for page-grid--[grid-area] and widget-ui--[title]
    className: `widget-ui--date-picker-widget${className ? ` ${className}` : ``}`
  };

  return <WidgetUi {...widgetUiSettings} />;
};
