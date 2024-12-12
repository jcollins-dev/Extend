import React from 'react';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MachineStatusIconContainer } from './MachineStatusIcon.elements';
import { MachineStatusIconProps } from './MachineStatusIcon.types';
import { useGetMachineConnectionStatusQuery } from 'api';
import { TooltipWrapper } from '../TooltipWrapper/TooltipWrapper';

const machineStatus = (
  machineId: string
): {
  hasError: string | false;
  isLoading: boolean;
  hasStatus: string | null | undefined;
} => {
  const { data, isFetching } = useGetMachineConnectionStatusQuery(
    { machineId: machineId as string },
    { pollingInterval: 30000 }
  );

  return {
    hasError: !machineId && 'failed to load machine',
    isLoading: isFetching ? true : false,
    hasStatus: data && data.watchdog
  };
};

export const MachineStatusIcon = ({ machineId }: MachineStatusIconProps): JSX.Element => {
  const { hasError, isLoading, hasStatus } = machineStatus(machineId as string);

  const status = isLoading ? 'loading' : hasError ? 'error' : hasStatus;

  const className = status
    ? `ui-machine-status-icon--${status} ui-machine-status-icon`
    : `ui-machine-status-icon`;

  return (
    <MachineStatusIconContainer className={className}>
      <TooltipWrapper
        {...{
          Tooltip: (
            <>
              <div className="ui-label">watchdog</div>
              <div className="ui-display">{hasStatus || `loading`}</div>
            </>
          )
        }}
      >
        <FontAwesomeIcon icon={faWifi} className="ui-machine-status-icon__icon" />
      </TooltipWrapper>
    </MachineStatusIconContainer>
  );
};
