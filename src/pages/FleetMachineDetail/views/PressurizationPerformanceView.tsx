import React from 'react';
import { PageGrid, useDateRange } from 'components';
import {
  PressurizationPerformanceTable,
  PressurizationPerformanceChart,
  UnnecessaryPressurizationWidget,
  AveragePressurizationTimeWidget
} from '../components';
import { MachineIssuesWrapperAvure } from 'components/machine-health/MachineActiveIssues/indexV2';
import { MachineType } from 'types/machine-health';
import { MachineIssuesProvider } from 'hooks/useMachineAlarmsAlerts';
import { AlertStatus } from 'types/machine-health/alerts';

const gridSettings = {
  gridRows: `auto 250px 400px`,
  gridCOls: `1fr 1fr 1fr`,
  gridAreas:
    process.env.REACT_APP_ENABLE_PASCAL_HEALTH_ISSUES_WIDGET === 'true'
      ? `'c1 c2 c3''chart chart chart''table table table'`
      : `'c1 c2''chart chart''table table'`,
  gridGap: `1em`,
  gridCols:
    process.env.REACT_APP_ENABLE_PASCAL_HEALTH_ISSUES_WIDGET === 'true' ? `1fr 1fr 1fr` : `1fr 1fr`
};

export const PressurizationPerformanceView = (): JSX.Element => {
  const { startTime, endTime } = useDateRange().utcTZConvertedISO;

  const machineIssuesProviderSettings = {
    pollingInterval: 60000,
    machineType: MachineType.Avure,
    alertStatus: AlertStatus.NotComplete,
    isAlarms: false,
    isAlerts: true,
    isMachineAlerts: false,
    start_datetime: startTime,
    end_datetime: endTime
  };

  return (
    <PageGrid {...gridSettings}>
      <AveragePressurizationTimeWidget gridArea="c1" />
      <UnnecessaryPressurizationWidget gridArea="c2" />
      {process.env.REACT_APP_ENABLE_PASCAL_HEALTH_ISSUES_WIDGET === 'true' && (
        <MachineIssuesProvider {...machineIssuesProviderSettings}>
          <MachineIssuesWrapperAvure gridArea="c3" />
        </MachineIssuesProvider>
      )}
      <PressurizationPerformanceChart gridArea="chart" />
      <PressurizationPerformanceTable gridArea="table" />
    </PageGrid>
  );
};
