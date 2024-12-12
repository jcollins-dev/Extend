// We can possibly use only one, but need to research regarding timframe that we use in params when calling api

// 3rd party
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
import useMachineStateProtein from 'hooks/useMachineStateProtein';
import moment from 'moment';

interface State {
  state?: string;
  timestamp?: string;
}

type ContextType = {
  machineState?: State;
  setMachineState?: (state: State) => void;
  isLoading: boolean;
};

const defaultValue = {
  machineState: undefined,
  setMachineState: (state: State) => console.log(state),
  isLoading: false
};

type Props = {
  machineId?: string;
  children?: ReactNode;
  timeZone?: string;
};

const ProteinmachineStatusContext = createContext<ContextType>(defaultValue);

export const useProteinmachineStatus = (): ContextType => {
  return useContext(ProteinmachineStatusContext);
};

// This provider is used on Production tab of machine health for Protein

export const ProteinmachineStatusProvider = (props: Props): JSX.Element => {
  const { machineId, children, timeZone } = props;
  const [machineState, setMachineState] = useState<State>({
    state: undefined,
    timestamp: undefined
  });

  if (!machineId) return <></>;

  const tz = timeZone ?? 'UTC';
  // takes current time, suntracts last 15 minutes (because we want to grab latest state),
  // converts it to machine timezone (or UTC if no timezone) and formats it for API call
  const localStartDatetimeString = moment()
    .subtract(10, 'minutes')
    .tz(tz)
    .format('YYYY-MM-DDTHH:mm:ssZ');

  const { states, isLoading } = useMachineStateProtein(machineId, localStartDatetimeString, 30000);

  useEffect(() => {
    // states come back sorted, so we just ned to grab latest value
    const lastState = states?.[states?.length - 1];
    const state = lastState?.name?.toString();
    const time = lastState?.end_timestamp?.toString();

    setMachineState({ state, timestamp: time });
  }, [states, machineId]);

  const value = {
    machineState,
    setMachineState,
    isLoading
  };

  return (
    <ProteinmachineStatusContext.Provider value={value}>
      {children}
    </ProteinmachineStatusContext.Provider>
  );
};
