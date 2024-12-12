/*
 * Query machine data
 */

import { useGetAsepticMachineHealthChangeoverByDateRangeQuery } from 'api';
import { FetchBaseQueryError, skipToken } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { AsepticChangeoverType } from 'types/machine-health/aseptic';
import { CleaningSession } from 'types/protein';

type Response = {
  data: CleaningSession[] | undefined;
  isFetching: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

export const useGetAsepticMachineHealthChangeoverToCleaningSession = (
  machineId: string,
  start_date: string,
  end_date: string,
  limit?: number
): Response => {
  const {
    data: changeovers,
    error,
    isFetching
  } = useGetAsepticMachineHealthChangeoverByDateRangeQuery(
    start_date && end_date
      ? {
          machineId,
          start_date,
          end_date,
          limit
        }
      : skipToken
  );

  const data =
    changeovers &&
    changeovers.map((changeover: AsepticChangeoverType) => {
      return {
        id: changeover.id,
        startTimestamp: changeover.startDate + 'T' + changeover.startTime + '+00:00',
        endTimestamp: changeover.endDate
          ? changeover.endDate + 'T' + changeover.endTime + '+00:00'
          : undefined,
        alarms: 0
      } as CleaningSession;
    });
  return { data, isFetching, error };
};
