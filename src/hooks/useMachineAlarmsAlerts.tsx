import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import {
  useGetAlertsByMachineIdQuery,
  useGetMachineDataScienceAlertsQuery,
  useGetMachineOverviewAlarmsQuery
} from 'api';
import { useParams } from 'react-router';
import { Alarm } from 'types/machine-health/alarms';
import { Alert, AlertStatus } from 'types/machine-health/alerts';

// Layers:

// 1. Provider - gets all data
// 2. Business logic - layer where we decide which alarms issues we are showing/hiding and any other BU specific logic
// 3. UI component - dummy component that just takes props from level above

// DEV NOTES:

// useGetMachineOverviewAlarmsQuery
// 	/mh/v1/${machineType}/machine-health/${machineId}/alarms/active
// 	/mh/v1/machine-alarms/${machineId}/active

// useGetMachineDataScienceAlertsQuery
// 	/fps/v1/machines/${machineId}/alerts

// useGetAlertsByMachineIdQuery
// 	/mh/v2/machine/${machineId}/machine-alerts${addArgsToPath(params)}

interface Props {
  pollingInterval: number;
  alertStatus?: AlertStatus;
  machineType: string;
  children?: ReactNode;
  //**Do we pull information for alarms: true - yes, false - no */
  isAlarms: boolean;
  //**Do we pull information for alerts: true - yes, false - no */
  isAlerts: boolean;
  //**Do we pull information for machine alerts: true - yes, false - no */
  isMachineAlerts: boolean;
  start_datetime?: string;
  end_datetime?: string;
}

type ContextType = {
  alarms?: Alarm[];
  alerts?: Alert[];
  mAlerts?: Record<string, unknown>[];
  hasError?: boolean;
  isLoading?: boolean;
};

const defaultValue = {
  isLoading: true
};

const MachineIssuesContext = createContext<ContextType>(defaultValue);

export const MachineIssuesProvider = ({
  pollingInterval,
  alertStatus,
  machineType,
  children,
  isAlarms,
  isAlerts,
  isMachineAlerts,
  start_datetime,
  end_datetime
}: Props): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();

  let alarmsData = [] as Alarm[];
  let alarmsLoading;
  let alarmsError;

  let alertsData = [] as Alert[];
  let alertsLoading;
  let alertsError;

  let machineAlerts = [] as Record<string, unknown>[];
  let machineAlertsLoading;
  let machineAlertsError;

  if (isAlarms) {
    const response = useGetMachineOverviewAlarmsQuery(
      { machineId, machineType },
      { pollingInterval }
    );
    alarmsData = response.data ?? [];
    alarmsLoading = response.isLoading;
    alarmsError = response.isError;
  }

  if (isAlerts) {
    const response = useGetMachineDataScienceAlertsQuery(
      {
        machineId,
        status: alertStatus,
        start_datetime: start_datetime && start_datetime,
        end_datetime: end_datetime && end_datetime
      },
      { pollingInterval: 60000 }
    );
    alertsData = response.data ?? [];
    alertsLoading = response.isLoading;
    alertsError = response.isError;
  }

  // Machine alerts have a different schema than alarms and alerts data
  if (isMachineAlerts) {
    const response = useGetAlertsByMachineIdQuery({
      machineId,
      active: true
    });
    machineAlerts = response.data ?? [];
    machineAlertsLoading = response.isLoading;
    machineAlertsError = response.isError;
  }

  const isLoading = alarmsLoading || alertsLoading || machineAlertsLoading;
  const hasError = (alarmsError || alertsError || machineAlertsError) as unknown as
    | boolean
    | undefined;

  const alarms = useMemo(() => alarmsData, [alarmsData]);
  const alerts = useMemo(() => alertsData, [alertsData]);
  const mAlerts = useMemo(() => machineAlerts, [machineAlerts]);

  const value = {
    alarms,
    alerts,
    mAlerts,
    isLoading,
    hasError
  };

  return <MachineIssuesContext.Provider value={value}>{children}</MachineIssuesContext.Provider>;
};

export const useMachineIssues = (): ContextType => {
  return useContext(MachineIssuesContext);
};
