import React, { ReactNode } from 'react';
import { MachineConnectionIconContainer } from './MachineConnectionIcon.elements';
import { IcoMachineStatusConnected } from 'icons/IcoMachineStatusConnected';

export interface MachineConnectionIconProps {
  status?: string;
}

interface Props extends MachineConnectionIconProps {
  children?: ReactNode | ReactNode[];
}

export const MachineConnectionIcon = ({ children, status }: Props): JSX.Element => {
  let color = 'rgba(102, 102, 102, 1)';
  let text = children || '. . .';

  if (status === 'connected') {
    color = '#008200';
    text = 'Connected';
  }

  return (
    <MachineConnectionIconContainer {...{ color }}>
      {text}
      <IcoMachineStatusConnected {...{ color }} />
    </MachineConnectionIconContainer>
  );
};
