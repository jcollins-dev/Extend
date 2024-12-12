export interface MachineStatusIconStatusProps {
  machineStatus?: string;
  dataStatus?: string;
  /** timestamp of last data stream */
  lastConnected?: string;
  isLoading?: boolean;
  hasError?: string;
  productionState?: string;
  watchDog?: string;
  businessUnit?: string;
}

export interface MachineStatusIconProps extends MachineStatusIconStatusProps {
  machineId?: string;
  gridArea?: string;
  /** for tooltip positioning */
  bottom?: boolean;
  /** for controlling tooltip externally */
  isOpen?: boolean;
}
