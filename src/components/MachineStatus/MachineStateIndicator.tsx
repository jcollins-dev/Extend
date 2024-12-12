import React from 'react';
import { MachineStateStatusIcon } from './MachineState';
import { MachineStateContainer } from './Status.elements';
import { mappedStateDSI, mappedStateProtein } from './utils/BUsMachineStatusMapping';
import { BusinessUnit } from 'types/dsi';

interface MachineStateProps {
  machineState?: string;
  isLoading?: boolean;
  businessUnit?: string;
  isDisconnected?: boolean;
}

export const MachineState = ({
  machineState,
  isLoading,
  businessUnit,
  isDisconnected
}: MachineStateProps): JSX.Element => {
  if (isLoading) return <></>;

  const baseClass = 'state';

  if (!businessUnit) return <></>;

  //if true then change status to disconnected
  if (isDisconnected) machineState = 'Disconnected';

  // This logic depend on businessUnit because business units have different backend support
  // when it comes to machine statuses
  let mappedState;
  if (businessUnit === BusinessUnit.DSI) {
    mappedState = machineState && mappedStateDSI[machineState];
  } else if (businessUnit === BusinessUnit.PROTEIN) {
    mappedState = machineState && mappedStateProtein[machineState];
  } else {
    //right now we have machine status for Protein and DSI only
    return <></>;
  }

  const state = machineState && mappedState ? mappedState : 'Unknown';

  return (
    <MachineStateContainer>
      Machine State:
      <span className={baseClass + ` ${state.toLowerCase()}`}>{state}</span>
      <MachineStateStatusIcon state={state} />
    </MachineStateContainer>
  );
};
