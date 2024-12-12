// 3rd party libs
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// Components
import { useDateRange } from 'components';
import { processApiData } from 'components/StyledUi/js/processApiData';

// API
import { useGetDSIAlarmsQuery } from 'api';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';

export interface MachineAlarmsReturnProps {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  data?: Record<string, unknown>[];
  apiData?: {
    data?: Record<string, unknown>[];
    isLoading?: boolean;
    hasError?: string;
    hasMessage?: string;
  };
}

const MachineAlarmsContext = createContext<MachineAlarmsReturnProps>({
  isLoading: true
});

export const useMachineAlarmsContext = (): MachineAlarmsReturnProps =>
  useContext(MachineAlarmsContext);

export const MachineAlarmsProvider = ({ children }: { children?: ReactNode }): JSX.Element => {
  const { isoDateRange, timeZone } = useDateRange();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  let hasError: string | undefined = undefined;

  const apiCall = useGetDSIAlarmsQuery({
    machineId: machineId,
    startDatetime: isoDateRange?.startTime,
    endDatetime: isoDateRange?.endTime,
    logType: ['ALARM']
  });

  console.log({ apiCall });

  const { data, isLoading, isFetching, error } = apiCall;

  if (error) {
    hasError = `error getting machine alarms`;
    console.log(`ERROR: Error getting data in useMachineAlarms.tsx`, { error });
  }

  const apiCallCache = useMemo(() => {
    if (
      (!data && !isLoading && !isFetching && !hasError) ||
      (data && (!data.length || data?.length === 0))
    ) {
      return { hasMessage: 'no data available' };
    }

    if (data) {
      return {
        data: processApiData(data, {
          startTimeKey: 'timestamp',
          addDateAsKey: 'date',
          addDurationAsKey: 'duration',
          timeZone
        })
      };
    }

    return { isLoading: isLoading || isFetching ? true : undefined, hasError };
  }, [data, isLoading, isFetching, error, isoDateRange, timeZone]);

  return (
    <MachineAlarmsContext.Provider value={{ ...apiCallCache, apiData: apiCallCache }}>
      {children}
    </MachineAlarmsContext.Provider>
  );
};
