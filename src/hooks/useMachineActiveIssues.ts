import { useGetMachineDataScienceAlertsQuery, useGetMachineOverviewAlarmsQuery } from 'api';
import { useParams } from 'react-router-dom';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Alarm } from 'types/machine-health/alarms';
import { Alert, AlertStatus } from 'types/machine-health/alerts';
import { MachineType } from 'types/machine-health';

type Response = {
  alarmsData: Alarm[] | undefined;
  alertsData: Alert[] | undefined;
  alarmsLoading: boolean;
  alertsLoading: boolean;
  alarmsError?: FetchBaseQueryError | SerializedError | undefined;
  alertsError?: FetchBaseQueryError | SerializedError | undefined;
};

const useMachineActiveIssues = (
  machineType: MachineType.Aseptic | MachineType.DSI | undefined,
  pollingInterval = 30000
): Response => {
  const { machineId } = useParams<{ machineId: string }>();

  const {
    data: alarmsData,
    isLoading: alarmsLoading,
    error: alarmsError
  } = useGetMachineOverviewAlarmsQuery({ machineId, machineType }, { pollingInterval });
  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError
  } = useGetMachineDataScienceAlertsQuery(
    {
      machineId,
      status: AlertStatus.NotComplete
    },
    { pollingInterval }
  );
  return { alarmsData, alarmsLoading, alarmsError, alertsData, alertsLoading, alertsError };
};

export default useMachineActiveIssues;
