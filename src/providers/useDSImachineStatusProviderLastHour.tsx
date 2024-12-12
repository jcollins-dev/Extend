// 3rd party
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { find } from 'lodash';

// Types
import { BusinessUnit, DSIKpiId, DSIKPIType, MachineHealthInterval } from 'types/dsi';

// API
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';

type ContextType = {
  machineStatus?: string;
  setMachineStatus?: (status: string | undefined) => void;
};

type Props = {
  machineId: string;
  children?: ReactNode;
};

const defaultValue = {
  machineStatus: undefined,
  setMachineStatus: () => undefined
};

const DSImachineStatusContext = createContext<ContextType>(defaultValue);
export const useDSImachineStatus = (): ContextType => {
  return useContext(DSImachineStatusContext);
};

// This provider is used on Production tab of machine health for DSI
export const DSImachineStatusProvider = (props: Props): JSX.Element => {
  const { machineId, children } = props;
  const [machineStatus, setMachineState] = useState<string | undefined>();

  const { machineHealth: currentKpiResult } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.DsiCurrentKpi,
    MachineHealthInterval.LastHour,
    true,
    BusinessUnit.DSI
  );

  useEffect(() => {
    const stateObject = find(currentKpiResult, (e) => {
      return e.id === DSIKpiId.StateName;
    });

    const state = stateObject?.value?.value?.toString();
    setMachineState(state);
  }, [currentKpiResult, machineId]);

  const value = {
    machineStatus,
    setMachineState
  };

  return (
    <DSImachineStatusContext.Provider value={value}>{children}</DSImachineStatusContext.Provider>
  );
};
