import React from 'react';
import { MachineConnectionIcon } from './MachineStatus';
import { MachineStatusContainer } from './Status.elements';
import { mappedStatuses } from './utils/BUsMachineStatusMapping';

import { formatDate } from 'helpers';

interface MachineStatusIndicatorProps {
  machineStatus?: string;
  lastConnected?: string;
  isLoading?: boolean;
  isDisconnected?: boolean;
  businessUnit?: string;
}

export const MachineStatusIndicator = ({
  machineStatus,
  lastConnected,
  isLoading,
  isDisconnected,
  businessUnit
}: MachineStatusIndicatorProps): JSX.Element => {
  if (isLoading) return <></>;

  // Currently we display connected/disconnected statuses only for protein and DSI.
  // Pascal doesn't have watchdog or any timestamp indicating last recorded state
  if (!businessUnit) return <></>;

  const baseClass = 'machine_status';
  const connected = <p className={baseClass + ` connected`}>Connected</p>;
  const disconnected = <p className={baseClass + ` disconnected`}>Offline</p>;
  const lastConnectedDate = lastConnected
    ? '  (' + formatDate(lastConnected, 'numeric-date-time') + ')'
    : '';

  if (isDisconnected) machineStatus = 'Disconnected';

  const displayStatus = machineStatus && mappedStatuses[machineStatus];

  return (
    <MachineStatusContainer>
      {machineStatus && displayStatus === 'Connected' ? connected : disconnected}
      <MachineConnectionIcon {...{ displayStatus }} />
      {lastConnectedDate && displayStatus === 'Offline' && (
        <p className={`${baseClass}` + ' last_known_connected'}> {lastConnectedDate} </p>
      )}
    </MachineStatusContainer>
  );
};
