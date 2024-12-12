import React, { ReactNode } from 'react';
import { UseApiDataProvider } from 'components/StyledUi/hooks';
import { useGetMachineAlarmsQuery } from 'api';
import { useParams } from 'react-router';
import { useDateRange } from 'components';
import { processApiData } from 'components/StyledUi/js';
interface Props {
  children?: ReactNode | ReactNode[];
}
export const UseProteinMachineAlarmsProvider = ({ children }: Props): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { isoDateRange, timeZone } = useDateRange();
  const { startTime, endTime } = isoDateRange;

  // Fetch alarms from api
  const { data, isFetching, error, isLoading } = useGetMachineAlarmsQuery({
    machineId: machineId,
    startDatetime: startTime,
    endDatetime: endTime
  });

  const processedData = processApiData(data, {
    startTimeKey: 'startTimestamp',
    endTimeKey: 'endTimestamp',
    addDurationAsKey: 'duration',
    addDateAsKey: 'date',
    excludeKeys: ['remedy'],
    addAsUndefined: ['location', 'type', 'description'],
    timeZone
  });

  const sortedProcessedData = processedData
    ?.reverse()
    ?.sort((x, y) =>
      x.duration === 0 || !x.duration ? -1 : y.duration === 0 || !y.duration ? 1 : 0
    );

  const returnValue = {
    isLoading: isLoading || isFetching ? true : undefined,
    hasMessage: error ? 'there was an error getting data' : undefined,
    data: sortedProcessedData
  };

  if (error) console.log('useProteinMachineAlarms', { error });

  return <UseApiDataProvider {...returnValue}>{children}</UseApiDataProvider>;
};
