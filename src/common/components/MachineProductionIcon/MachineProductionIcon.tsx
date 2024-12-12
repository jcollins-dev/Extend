import React, { ReactNode } from 'react';
import { MachineProductionIconContainer } from './MachineProductionIcon.elements';
import { IcoCheckMark } from 'icons/IcoCheckMark';
import { StyledUiContainerProps } from 'components';

export interface MachineProductionIconProps extends StyledUiContainerProps {
  status?: string;
}

interface Props extends MachineProductionIconProps {
  children?: ReactNode | ReactNode[];
}

export const MachineProductionIcon = ({ children, status, className }: Props): JSX.Element => {
  className = className ? ` ${className} machine-production-icon` : `machine-production-icon`;

  let color = 'rgba(102, 102, 102, 1)';
  let text = children || '. . .';

  if (status === 'running') {
    color = '#008200';
    text = 'Running';
    className = `${className} machine-production-icon--running`;
  }

  return (
    <MachineProductionIconContainer {...{ color, className }}>
      {text}
      <span className="machine-production-icon__icon-wrapper">
        <IcoCheckMark {...{ color }} />
      </span>
    </MachineProductionIconContainer>
  );
};
