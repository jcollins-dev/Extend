import React from 'react';

//machine status
import { default as DisconnectedIcon } from './icons/status_disconnected.svg';
import { default as ConnectedIcon } from './icons/status_connected.svg';

interface Props {
  displayStatus?: string;
}

export const MachineConnectionIcon = ({ displayStatus }: Props): JSX.Element => {
  const baseClass = 'machine_status';

  switch (displayStatus?.toUpperCase()) {
    case 'CONNECTED':
      return <img className={`${baseClass}` + '_icon'} src={ConnectedIcon} />;
    case 'NOT_CONNECTED':
      return <img className={`${baseClass}` + '_icon'} src={DisconnectedIcon} />;
    default:
      //return not connected
      return <img className={`${baseClass}` + '_icon'} src={DisconnectedIcon} />;
  }
};
