// 3rd party libs
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// Components
import { useDateRange } from 'components';

// API
import { useGetDSIAlarmsQuery } from 'api';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';
import { DSIAlarm } from 'types/machine-health/alarms';

export interface MachineAlarmsReturnProps {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  data?: DSIAlarm[];
}

const MachineAlarmsContext = createContext<MachineAlarmsReturnProps>({
  isLoading: true
});

export const useMachineAlarmsContext = (): MachineAlarmsReturnProps =>
  useContext(MachineAlarmsContext);

export const MachineAlarmsProvider = ({ children }: { children?: ReactNode }): JSX.Element => {
  const { data, isLoading, hasError } = useMachineAlarmsQuery();

  const value = {
    data,
    isLoading,
    hasError
  };

  return <MachineAlarmsContext.Provider value={value}>{children}</MachineAlarmsContext.Provider>;
};

const useMachineAlarmsQuery = (): {
  data?: DSIAlarm[];
  isLoading: boolean;
  hasError?: string;
} => {
  const { startTime, endTime } = useDateRange().isoDateRange;
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  const {
    data,
    isFetching: alarmsFetching,
    error: alarmsError
  } = useGetDSIAlarmsQuery({
    machineId: machineId,
    startDatetime: startTime,
    endDatetime: endTime
  });

  const cachedData = useMemo(() => data, [data]);

  const hasError = alarmsError ? `error getting machine alarms` : undefined;

  return { data: cachedData, isLoading: alarmsFetching, hasError };
};
