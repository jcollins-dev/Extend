import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useFleetMachineAccountData } from './useFleetMachineAcountData';
import { useGetAvureAlarmsQuery } from 'api';
import { useDateRange } from 'components';
import { Alarm } from 'types/machine-health/alarms';
import { processApiData } from 'components/StyledUi/js';

const GetAvureAlarmsContext = createContext<GetAvureAlarmsContextReturnProps>({
  isLoading: true
});

export const useGetAvureAlarms = (): GetAvureAlarmsContextReturnProps => {
  return useContext(GetAvureAlarmsContext);
};

interface Props {
  children?: ReactNode | ReactNode[];
}

export interface GetAvureAlarmsContextReturnProps {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  isFetching?: boolean;
  data?: Record<string, unknown>[];
  rawData?: Alarm[];
}

export const GetAvureAlarmsProvider = ({ children }: Props): JSX.Element => {
  const { machineId } = useFleetMachineAccountData();

  const { startTime: startDatetime, endTime: endDatetime } = useDateRange().isoDateRange;

  const {
    data: rawData,
    isFetching,
    error,
    isLoading
  } = useGetAvureAlarmsQuery({
    machineId: machineId as string,
    startDatetime,
    endDatetime
  });

  const processedData = useMemo(() => {
    if (rawData) {
      const processed = processApiData(rawData, {
        // ads the start of day as an iso string to new key `date`
        addDateAsKey: `date`,

        // calculates duration and adds new key `duration`
        addDurationAsKey: `duration`,

        // define the time stamp keys
        startTimeKey: `startTimestamp`,
        endTimeKey: `endTimestamp`,
        timeZone: `Europe/Amsterdam`,

        // converts the values of `type`, but leaves the key the same
        convertKeys: {
          type: {
            Critical: `A-Alarm`,
            'Product Alarm': `B-Alarm`,
            Warning: `C-Alarm`
          }
        }
      });

      return processed;
    }
  }, [rawData, isFetching]);

  let hasMessage: string | undefined = undefined;

  const hasError = error ? `error getting alarms data` : undefined;

  if (!isLoading && !hasMessage && !isFetching && processedData?.length === 0)
    hasMessage = 'no data to display';

  const value = {
    isLoading,
    isFetching,
    hasMessage,
    hasError,
    data: processedData,
    rawData
  };

  return <GetAvureAlarmsContext.Provider {...{ value }}>{children}</GetAvureAlarmsContext.Provider>;
};
