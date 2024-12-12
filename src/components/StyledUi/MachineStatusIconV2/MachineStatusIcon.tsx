import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MachineStatusIconTooltip, MachineStatusIconWrapper } from './MachineStatusIcon.elements';
import { MachineStatusIconProps } from './MachineStatusIcon.types';
import { TooltipWrapper } from 'components';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

/**
 * MachineStatusIcon takes in several props such as isOpen, bottom, isLoading, hasError, machineStatus, dataStatus,
 * productionState, and lastConnected, which are used to determine the status of the machine and display the appropriate
 * icon and tooltip.
 *
 * it first defines an object called "green", which contains the status values that indicate a positive
 * status. It then defines a function called "statusClass", which maps a status class name to a status value.
 *
 * it uses moment.js to parse the "lastConnected" prop, which represents the last time the machine was
 * connected to the network.
 *
 * it then sets the default tooltip to "loading machine" and the overall status to "loading". If the
 * "productionState" prop exists, the overall status is set to "productionState". If there is an error, the overall status
 * is set to "error" and the error message is used as the tooltip.
 *
 * If there is no error and isLoading is false, the overall status is set to "good" if both "machineStatus" and "dataStatus"
 * are positive. MachineStatusIcon creates a tooltip component with the status information, including the machine status,
 * data status, production state, and last connected date.
 *
 * Finally, it assigns a status class based on the overall status, and renders the machine status icon with the
 * appropriate status class and tooltip.
 */

// Defines the status values that indicate a positive status
const green: { [key: string]: boolean } = {
  ok: true,
  good: true,
  running: true,
  success: true
};

// Define the props type
export const MachineStatusIcon = ({
  isOpen,
  bottom,
  isLoading,
  hasError,
  machineStatus,
  dataStatus,
  productionState,
  lastConnected
}: MachineStatusIconProps): JSX.Element => {
  // Define the class name for MachineStatusIcon
  const className = `machine-status-icon`;

  // Maps the status class name to the status value
  const statusClass = (c?: string) => (!c ? `` : `status--${c.toLowerCase().replace(/ /g, '-')} `);

  // Parses the last connected date with moment.js
  const parsedDate = moment(lastConnected);

  // The default tooltip is "loading machine"
  let Tooltip: ReactNode = `loading machine`;

  // Overall status of the machine
  let overallStatus = `loading`;

  // If productionState exists, sets the overall status to it
  if (productionState) overallStatus = productionState;

  // If there is an error, sets the overall status to "error" and uses the error message as the tooltip
  if (!isLoading && !hasError && !dataStatus && !productionState && !machineStatus)
    hasError = `Failed to load machine.`;

  if (hasError) {
    Tooltip = hasError;
    overallStatus = `error`;
  } else if (!isLoading) {
    // If there is no error and isLoading is false, it sets the overall status to "good" if both machineStatus and dataStatus are positive
    if (machineStatus && dataStatus) {
      overallStatus = 'good';
      if (!green[machineStatus] || !green[dataStatus]) overallStatus = `warning`;
    }

    // Creates a tooltip component with the status information
    Tooltip = (
      <MachineStatusIconTooltip>
        {machineStatus && (
          <>
            <FontAwesomeIcon
              className={`${statusClass(machineStatus)}status__font`}
              icon={faWifi}
            />
            <div>
              machine:{' '}
              <span className={`${statusClass(machineStatus)}status__font`}>{machineStatus}</span>
            </div>
          </>
        )}
        {dataStatus && (
          <>
            <FontAwesomeIcon className={`${statusClass(dataStatus)}status__font`} icon={faWifi} />
            <div>
              data: <span className={`${statusClass(dataStatus)}status__font`}>{dataStatus}</span>
            </div>
          </>
        )}
        {productionState && (
          <>
            <FontAwesomeIcon
              className={`${statusClass(productionState)}status__font`}
              icon={faWifi}
            />
            <div>
              Production State:{' '}
              <span className={`${statusClass(productionState)}status__font`}>
                {productionState}
              </span>
            </div>
          </>
        )}

        {lastConnected && (
          <div className={`${className}__date`}>Last data received {parsedDate.format('l LT')}</div>
        )}
      </MachineStatusIconTooltip>
    );
  }

  // assign status class based on status.  convert for css
  overallStatus = overallStatus.toLowerCase().split(' ').join('-');

  const iconClassName = `${className}__icon status-icon status__font status--${overallStatus}`;

  return (
    <MachineStatusIconWrapper className="machine-status-icon">
      <TooltipWrapper {...{ Tooltip, isOpen, bottom }}>
        <FontAwesomeIcon icon={faWifi} className={iconClassName} />
      </TooltipWrapper>
    </MachineStatusIconWrapper>
  );
};
