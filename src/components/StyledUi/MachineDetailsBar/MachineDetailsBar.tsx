import React from 'react';
import {
  MachineDetailsBarContainer,
  MachineDetailsBarContainerProps
} from './MachineDetailsBar.elements';
import { MachineState } from 'components/MachineStatus/MachineStateIndicator';

export interface MachineDetailsBarProps extends MachineDetailsBarContainerProps {
  serialNumber?: string;
  orderNumber?: string;
  productionState?: string;
  isLoading?: boolean;
  hasError?: string;
  formattedZone?: string;
  isDisconnected?: boolean;
  businessUnit?: string;
  machineId?: string;
}

interface ItemProps {
  label?: string;
  val?: string;
  isLoading?: boolean;
  hasError?: string;
}
const Item = ({ label, val, isLoading, hasError }: ItemProps): JSX.Element => {
  let className = `machine-details-bar__item`;

  if (isLoading) {
    val === '...';
    className = `${className} ${className}--is-loading`;
  }
  if (hasError) {
    val === `${label} Error`;
    className = `${className} ${className}--has-error`;
  }
  if (!isLoading && !hasError && !val) {
    val = `error`;
    className = `${className} ${className}--has-error`;
  }

  if (label === 'Production State') className = `${className} status__font`;

  return (
    <div className={className}>
      {label ? label + ' :' : null} {val}
    </div>
  );
};

export const MachineDetailsBar = ({
  serialNumber,
  productionState,
  isLoading,
  hasError,
  className,
  gridArea,
  formattedZone,
  isDisconnected,
  businessUnit
}: MachineDetailsBarProps): JSX.Element => {
  let baseClass = `machine-details-bar`;

  if (productionState) className = `${className ? `${className} ` : ``}state--${productionState}`;

  if (isLoading) baseClass = `${baseClass} ${baseClass}--is-loading`;
  else if (hasError) baseClass = `${baseClass} ${baseClass}--has-error`;

  const containerSettings = {
    className: `${baseClass}${className ? ` ${className}` : ``}`,
    gridArea
  };

  const machineStateSettings = {
    isLoading,
    machineState: productionState,
    isDisconnected,
    businessUnit
  };

  return (
    <MachineDetailsBarContainer {...containerSettings}>
      <Item label="Serial Number" val={serialNumber} {...{ isLoading, hasError }} />
      {formattedZone && <Item val={formattedZone} />}
      <MachineState {...{ ...machineStateSettings }} />
    </MachineDetailsBarContainer>
  );
};
