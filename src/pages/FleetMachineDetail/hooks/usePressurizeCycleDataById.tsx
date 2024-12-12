import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { useDateRange } from 'components';
import { useGetPressurizeCycleDataByIdQuery } from 'api';

import { PressurizeCycle } from 'types/protein';
import { BaseType } from 'types';
import { useFleetMachineAccountData } from './useFleetMachineAcountData';
import { processApiData } from 'components/StyledUi/js';
import { generatePressurizedCycleChartData } from '../helpers';
import { LineChartDataItemProps } from 'components';

export interface UsePressurizeCycleDataByIdDataAvgProps {
  avgDeltaPressurizeTime?: number;
  avgIdealPressurizeTime?: number;
  avgPressurizeTime?: number;
}

export interface UsePressurizeCycleDataByIdDataSumProps {
  sumDeltaPressurizeTime?: number;
}

export type UsePressurizeCycleDataByIdDataReturnProps = UsePressurizeCycleDataByIdDataAvgProps &
  UsePressurizeCycleDataByIdDataSumProps;

interface PressurizeDataRow extends BaseType {
  systemId: string;
  batchNumber: string;
  lotId: string;
  batchSuccessful: boolean;
  startTime: string;
  endTime: string;
  idealPressurizeTime: string;
  deltaPressurizeTime: string;
  deltaPressurizeTimeValue: number;
  cycleTime: string;
  pressurizeTime: string;
}

export interface UsePressurizeCycleDataByIdReturnProps {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  data?: PressurizeCycle[];
  tableData?: PressurizeDataRow[];
  lineChartData?: LineChartDataItemProps[];
  batchCount?: {
    passed: number;
    failed: number;
  };
  avgWaitTime?: number;
}

const PressurizeCycleDataByIdContext = createContext<UsePressurizeCycleDataByIdReturnProps>({
  isLoading: true
});

const lastHourCheck = (date: string, currentDate: Date): boolean => {
  const targetDate = new Date(date);
  const timeDiff = currentDate.getTime() - targetDate.getTime();

  const secondsDiff = Math.floor(timeDiff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);

  if (minutesDiff < 1) {
    return true;
  }

  if (hoursDiff < 1) {
    return true;
  }

  return false;
};

export const usePressurizeCycleDataById = (): UsePressurizeCycleDataByIdReturnProps =>
  useContext(PressurizeCycleDataByIdContext);

interface PressurizeCycleDataByIdProviderProps {
  children?: ReactNode | ReactNode[];
}

export const PressurizeCycleDataByIdProvider = ({
  children
}: PressurizeCycleDataByIdProviderProps): JSX.Element => {
  const { machineId } = useFleetMachineAccountData();
  const [waitTimes, setWaitTimes] = useState<number[]>([]);
  const [batchCount, setBatchCount] = useState({
    failed: 0,
    passed: 0,
    all: 0
  });

  const { utcTZConvertedISO, timeZone } = useDateRange();

  const { data, isLoading, isError, isSuccess, isFetching } = useGetPressurizeCycleDataByIdQuery({
    machineId: machineId as string,
    startDatetime: utcTZConvertedISO.startTime,
    endDatetime: utcTZConvertedISO.endTime,
    limit: 100000
  });

  const batch = {
    failed: 0,
    passed: 0,
    all: 0
  };

  const waitTimes2: number[] = [];

  const pressureData = useMemo(() => {
    //do we need to account for timezone?
    const currentDate = new Date();

    const processedData = processApiData(data, {
      timeZone,
      startTimeKey: `startTime`,
      endTimeKey: `endTime`,
      addDuration: true,
      addDurationAsKey: 'cycleTime'
    });

    if (processedData) {
      return processedData.reduce((acc: Record<string, unknown>[], d, i) => {
        const newItem = { ...d, rowKey: i, deltaPressurizeTime: d.deltaPressurizeTime };
        const isWithinTheHour = lastHourCheck(d.endTime as string, currentDate);

        if (isWithinTheHour) {
          if (d.batchSuccessful) {
            batch.passed = batch.passed + 1;
            setBatchCount({ ...batch, passed: batch.passed + 1 });
            //waitTimes.push(d.cycleTime as number)
          } else {
            batch.failed = batch.failed + 1;
            setBatchCount({ ...batch, failed: batch.failed + 1 });
          }
        }
        waitTimes2.push(d.cycleTime as number);
        setWaitTimes(waitTimes2);

        batch.all = batch.all + 1;
        setBatchCount({ ...batch, all: batch.all + 1 });

        return (acc = [...acc, newItem]);
      }, []);
    }
    return undefined;
  }, [data, isLoading, isError, isFetching]);

  const avg = waitTimes.reduce((acc, curr) => acc + curr, 0) / waitTimes.length;
  const avgWaitTime = Math.floor(avg);

  const lineChartData = !pressureData
    ? undefined
    : (generatePressurizedCycleChartData(pressureData) as LineChartDataItemProps[]);

  const value = {
    lineChartData,
    isLoading: isLoading ? true : false,
    hasError: isError ? `error getting pressure data` : undefined,
    hasMessage: isSuccess && !data ? `no pressure data available` : undefined,
    data,
    tableData: pressureData as PressurizeDataRow[],
    batchCount: data ? batchCount : undefined,
    avgWaitTime
  };

  // all reqs are met for next step in provider
  // sending needed items down a level
  return (
    <PressurizeCycleDataByIdContext.Provider value={value}>
      {children}
    </PressurizeCycleDataByIdContext.Provider>
  );
};
