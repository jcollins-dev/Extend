import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useGetAccountInfoQuery } from 'api';
import { useParams } from 'react-router-dom';
import { AccountInfoConnectionStatus } from 'types/machine-health';
import moment from 'moment';

const WatchdogContext = createContext<WatchdogContextReturnProps>({
  connectionStatus: undefined,
  isLoading: false,
  isDisconnected: false
});

export const useWatchdog = (): WatchdogContextReturnProps => {
  return useContext(WatchdogContext);
};

interface Props {
  children?: ReactNode | ReactNode[];
  timeZone?: string;
}

export interface WatchdogContextReturnProps {
  connectionStatus?: AccountInfoConnectionStatus;
  isLoading?: boolean;
  isDisconnected?: boolean;
}

export const NUM_OF_TIMESTAMPS_TO_CHECK = 5;

export const WatchdogProvider = ({ children }: Props): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();

  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);

  // connectionStatus comes back with UTC timestamp
  const { connectionStatus, isLoading } = useMachineWatchdog(machineId);

  // This block is to determine machine status, we save last 5 timestamps and if they are the same, machine is considered offline
  const lastConnectedDates = useRef<string[]>([]);

  useEffect(() => {
    if (!lastConnectedDates) return;

    // we will be comparing timestamps in UTC timezone
    const tz = 'UTC';

    //Check if it was more than 15 min ago
    const nowTimestamp = moment().subtract(15, 'minutes').tz(tz).valueOf();

    const apiTimestamp = connectionStatus && Date.parse(connectionStatus?.lastKnownConnected);

    // if we don't have any timestamp from api, or watchdog timestamp is way in the past then we set disconnected to true
    if (!apiTimestamp || apiTimestamp < nowTimestamp) {
      setIsDisconnected(true);
      return;
    }

    if (lastConnectedDates?.current?.length === NUM_OF_TIMESTAMPS_TO_CHECK) {
      lastConnectedDates?.current?.shift();
    }
    connectionStatus?.lastKnownConnected &&
      lastConnectedDates?.current?.push(connectionStatus.lastKnownConnected);

    //compare dates only when array has all 5 last values
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
  }, [connectionStatus, machineId]);

  const value: WatchdogContextReturnProps = {
    connectionStatus,
    isLoading,
    isDisconnected
  };

  return <WatchdogContext.Provider {...{ value }}>{children}</WatchdogContext.Provider>;
};

interface WatchdogResponse {
  connectionStatus?: AccountInfoConnectionStatus;
  isLoading?: boolean;
  isDisconnected?: boolean;
}

const useMachineWatchdog = (machineId: string): WatchdogResponse => {
  const { data, isLoading } = useGetAccountInfoQuery(
    { machineId },
    {
      pollingInterval: 30000
    }
  );

  const connectionStatus = data?.connectionStatus;

  const returnVal = {
    connectionStatus,
    isLoading
  };

  return { ...returnVal };
};

export default useMachineWatchdog;
