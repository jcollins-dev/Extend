// This provider is very similar to useDSImachineStatusProviderLastHour.tsx in providers
// Difference:
//  - Interval
//  - Historical data : false
// We can possibly use only one, but need to research regarding timframe that we use in params when calling api

// 3rd party
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { find } from 'lodash';

// Types
import { BusinessUnit, DSIKpiId, DSIKPIType, MachineHealthInterval } from 'types/dsi';

// API
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';
import { MachineHealthKpiItem } from 'types/machine-health';

interface State {
  state?: string;
  timestamp?: string;
}

type ContextType = {
  machineState?: State;
  setMachineState?: (state: State) => void;
  isLoading: boolean;
  isDisconnected?: boolean;
};

const defaultValue = {
  machineState: undefined,
  setMachineState: (state: State) => console.log(state),
  isLoading: false,
  isDisconnected: false
};

type Props = {
  machineId?: string;
  children?: ReactNode;
};

export const NUM_OF_TIMESTAMPS_TO_CHECK = 6;

const DSImachineStatusContext = createContext<ContextType>(defaultValue);

export const useDSImachineStatus = (): ContextType => {
  return useContext(DSImachineStatusContext);
};

// This provider is used on Production tab of machine health for DSI

export const DSImachineStatusProvider = (props: Props): JSX.Element => {
  const { machineId, children } = props;
  const [machineState, setMachineState] = useState<State>({
    state: undefined,
    timestamp: undefined
  });
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);

  if (!machineId) return <></>;

  const pollingInterval = 5000;

  // by default it pulls every 3 seconds
  const { machineHealth: currentKpiResult, isLoading } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.DsiCurrentKpi,
    MachineHealthInterval.Last15Min,
    false,
    BusinessUnit.DSI,
    undefined,
    pollingInterval
  );

  const lastConnectedDates = useRef<string[]>([]);

  // If api response is always the same,
  // the logic to compare timestamps will never be triggered and if api response is the same that means machine is offline
  // this is not 100% way to determine machine status, it would be good to have more reliable api method
  const currentKpiResultResponses = useRef<MachineHealthKpiItem[][]>([]);
  useEffect(() => {
    // 1. Check if api call is the same or not,
    // this way we determine if machine is running or offline
    if (currentKpiResultResponses?.current?.length === 2) {
      currentKpiResult && currentKpiResultResponses?.current?.shift();
    }

    currentKpiResult && currentKpiResultResponses?.current?.push(currentKpiResult);

    if (currentKpiResultResponses?.current?.length === 2) {
      const obj1 = JSON.stringify(currentKpiResultResponses?.current[0]);
      const obj2 = JSON.stringify(currentKpiResultResponses?.current[1]);
      if (obj1 === obj2) {
        setIsDisconnected(true);
        return;
      }
    } else {
      setIsDisconnected(false);
      return;
    }

    //2. Once we established that api is returning different values(machine is running)
    // then we compare timestamps
    const stateObject = find(currentKpiResult, (e) => {
      return e.id === DSIKpiId.StateName;
    });

    const state = stateObject?.value?.value?.toString();
    const timestamp = stateObject?.value?.timestamp.toString();

    if (lastConnectedDates?.current?.length === NUM_OF_TIMESTAMPS_TO_CHECK) {
      lastConnectedDates?.current?.shift();
    }

    timestamp && lastConnectedDates?.current?.push(timestamp);

    //compare dates only when array has all values
    if (lastConnectedDates?.current?.length === NUM_OF_TIMESTAMPS_TO_CHECK) {
      const isSameTimestamp = new Set(lastConnectedDates?.current);
      if (isSameTimestamp.size === 1) {
        setIsDisconnected(true);
      } else {
        setIsDisconnected(false);
      }
    } else {
      setIsDisconnected(false);
    }

    setMachineState({ state, timestamp });
  }, [currentKpiResult, machineId]);

  const value = {
    machineState,
    setMachineState,
    isLoading,
    isDisconnected
  };

  return (
    <DSImachineStatusContext.Provider value={value}>{children}</DSImachineStatusContext.Provider>
  );
};
