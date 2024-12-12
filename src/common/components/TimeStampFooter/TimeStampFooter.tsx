import React from 'react';
import { TimeStampFooterContainer } from './TimeStampFooter.elements';
import { useDateRange } from 'components';
import { IcoDateHistory } from 'icons/IcoDateHistory';
import { format, differenceInHours } from 'date-fns';

export interface TimeStampFooterProps {
  //  if you leave out children, the current date range will be used based on the dateRangeProvider
  children?: React.ReactNode;
}

export const TimeStampFooter = ({ children }: TimeStampFooterProps): JSX.Element => {
  const { dateRange } = useDateRange();

  let timeDisplay = '24 Hours';

  const hoursDifference = differenceInHours(dateRange.endTime, dateRange.startTime);

  if (hoursDifference <= 24) {
    timeDisplay = `Last ${hoursDifference} hours`;
  } else {
    const formattedStartDate = format(dateRange.startTime, 'MMMM d');
    const formattedEndDate = format(dateRange.endTime, 'MMMM d');
    timeDisplay = `${formattedStartDate} - ${formattedEndDate}`;
  }

  return (
    <TimeStampFooterContainer>
      <IcoDateHistory /> Viewing: <strong>{children || timeDisplay}</strong>
    </TimeStampFooterContainer>
  );
};
