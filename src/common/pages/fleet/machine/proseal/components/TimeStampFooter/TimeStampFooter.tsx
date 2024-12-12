import React from 'react';
import { TimeStampFooterContainer } from './TimeStampFooter.elements';
import { useDateRange } from 'components';

export interface TimeStampFooterProps {
  //  if you leave out children, the current date range will be used based on the dateRangeProvider
  children?: React.ReactNode;
}

export const TimeStampFooter = ({ children }: TimeStampFooterProps): JSX.Element => {
  const { startTime, endTime } = useDateRange().isoDateRange;
  const curView = `${startTime} - ${endTime}`;

  return (
    <TimeStampFooterContainer>
      Viewing: <strong>{children || curView}</strong>
    </TimeStampFooterContainer>
  );
};
