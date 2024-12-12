import React from 'react';
import { DateDisplayAreaContainer, DateDisplayIcon, baseClass } from './DateDisplayArea.elements';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import moment from 'moment';

export interface DateDisplayAreaProps extends StyledUiContainerProps {
  date: Date;
  label: string;
}
export const DateDisplayArea = ({
  date,
  label,
  gridArea,
  className
}: DateDisplayAreaProps): JSX.Element => {
  className = className ? `${className} ${baseClass}` : baseClass;

  return (
    <DateDisplayAreaContainer {...{ className, gridArea }}>
      <span className={`${baseClass}__label`}>{label}:</span>
      <span className={`${baseClass}__date-wrapper`}>
        <DateDisplayIcon />
        <span className={`${baseClass}__date`}>{moment(date).format('ll')}</span>
      </span>
    </DateDisplayAreaContainer>
  );
};
