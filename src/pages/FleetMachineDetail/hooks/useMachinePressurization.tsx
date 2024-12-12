import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDateRange } from 'components';
import { useGetMachinePressureQuery } from 'api';

export interface UseMachinePressurizationDataAvgProps {
  avgDeltaPressurizeTime?: number;
  avgIdealPressurizeTime?: number;
  avgPressurizeTime?: number;
}

export interface UseMachinePressurizationDataSumProps {
  sumDeltaPressurizeTime?: number;
}

export type UseMachinePressurizationDataReturnProps = UseMachinePressurizationDataAvgProps &
  UseMachinePressurizationDataSumProps;

export interface UseMachinePressurizationReturnProps {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  data?: UseMachinePressurizationDataReturnProps;
  machineId?: string;
}

const MachinePressurizationContext = createContext<UseMachinePressurizationReturnProps>({
  isLoading: true
});

export const useMachinePressurization = (): UseMachinePressurizationReturnProps =>
  useContext(MachinePressurizationContext);

interface MachinePressurizationProviderProps {
  children?: ReactNode | ReactNode[];
}

export const MachinePressurizationProvider = ({
  children
}: MachinePressurizationProviderProps): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  // get dange range from parent DateRangeProvider
  const { startTime, endTime } = useDateRange().utcTZConvertedISO;

  // NOTE: the startTime being sent to api call is not formatted with the timeZone offset
  // this looks like it's being done on BE for the useGetMachinePressureQuery
  // gets the machinePresurization data in the format found above in
  // Type: UseMachinePressurizationDataReturnProps
  const { isLoading, isError, isSuccess, data } = useGetMachinePressureQuery({
    machineId,
    startDatetime: startTime,
    endDatetime: endTime
  });

  const dataCache = useMemo(() => data, [data, isLoading, isError]);

  const value = {
    isLoading: isLoading ? true : false,
    hasError: isError ? `error getting pressure data` : undefined,
    hasMessage: isSuccess && !data ? `no pressure data available` : undefined,
    data: dataCache,
    machineId
  };

  return (
    <MachinePressurizationContext.Provider value={value}>
      {children}
    </MachinePressurizationContext.Provider>
  );
};
