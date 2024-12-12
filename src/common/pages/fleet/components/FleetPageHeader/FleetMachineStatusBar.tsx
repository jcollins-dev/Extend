import React from 'react';
import { FleetMachineStatusBarContainer } from './FleetMachineStatusBar.elements';
import { MachineProductionIcon } from 'common/components/MachineProductionIcon';
import { useCustomerMachine } from '../../hooks/useCustomerMachine';
import { useCustomerSite } from '../../hooks/useCustomerSite';

const Item = ({ label, value }: { label: string; value: string }): JSX.Element => {
  return (
    <div className="machine-status-bar__item">
      <div className="machine-status-bar__label">{label}: </div>
      <div className="machine-status-bar__value">{value}</div>
    </div>
  );
};

export const FleetMachineStatusBar = (): JSX.Element => {
  const machine = useCustomerMachine();
  const site = useCustomerSite();

  if (
    !machine?.serialNumber &&
    !machine?.orderNumber &&
    !machine?.productionStatus &&
    !site?.timeZone
  )
    return <></>;

  return (
    <FleetMachineStatusBarContainer className="machine-status-bar">
      {machine?.serialNumber && (
        <Item label="Serial Number" value={machine?.serialNumber as string} />
      )}

      {machine?.orderNumber && <Item label="Order Number" value={machine?.orderNumber as string} />}

      {site?.timeZone && <Item label="Timezone" value={site?.timeZone as string} />}

      {machine?.productionStatus && (
        <MachineProductionIcon
          status={machine?.productionStatus}
          className="machine-status-bar__item"
        />
      )}
    </FleetMachineStatusBarContainer>
  );
};
