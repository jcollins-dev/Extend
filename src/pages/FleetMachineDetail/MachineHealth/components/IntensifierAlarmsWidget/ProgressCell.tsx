import React from 'react';
import { ProgressCellContainerProps, ProgressCellContainer } from './ProgressCell.elements';

export interface ProgressCellProps extends ProgressCellContainerProps {
  labelPosition?: string;
  label: string | number;
}

export const ProgressCell = ({
  color,
  labelPosition,
  className,
  value,
  label
}: ProgressCellProps): JSX.Element => {
  className = className ? `${className} progress-cell` : `progress-cell`;

  if (labelPosition === 'outside') className += ' label-outside';
  else if (labelPosition === 'inside') className += ' label-inside';

  return (
    <ProgressCellContainer {...{ className, color, value }}>
      <span className="progress-cell__label">{label}</span>
      <span className="progress-cell__bar"></span>
    </ProgressCellContainer>
  );
};
