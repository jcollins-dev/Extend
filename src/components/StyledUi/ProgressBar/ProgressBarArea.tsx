import React from 'react';
import {
  ProgressBarAreaContainer,
  ProgressBar,
  ProgressBarAreaContainerProps
} from './ProgressBar.elements';

export interface ProgressBarAreaProps extends ProgressBarAreaContainerProps {
  className?: string;
}

const baseClass = `progress-bar-area`;

export const ProgressBarArea = ({
  className,
  gridArea,
  progress
}: ProgressBarAreaProps): JSX.Element => {
  if (!progress) return <></>;

  className = className ? `${baseClass} ${className}` : baseClass;

  return (
    <ProgressBarAreaContainer {...{ gridArea, className }}>
      <ProgressBar as="div" {...{ progress }} />
      <div className={`${baseClass}__value`}>{progress}%</div>
    </ProgressBarAreaContainer>
  );
};
