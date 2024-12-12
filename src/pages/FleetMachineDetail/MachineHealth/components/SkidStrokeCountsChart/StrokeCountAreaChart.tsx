import { MachineIssuesProvider } from 'hooks/useMachineAlarmsAlerts';
import React from 'react';
import { MachineType } from 'types/machine-health';
import { AlertStatus } from 'types/machine-health/alerts';
import { SkidStrokeCountsChartsWrapper } from './SkidStrokeCountsChartsWrapper';
import styled from 'styled-components';

export const StrokeCountContainer = styled.div`
  display: grid;
  grid-gap: inherit;
  grid-auto-flow: row;
  grid-gap: inherit;
  padding: 1rem;
  border-color: #c2c2c6;
  border-width: 1px;
  border-radius: 0.625rem;
  border-style: solid;

  .widget-ui.intensifier-stroke-count-widgetui {
    display: flex;

    & > div {
      display: flex;
    }
  }
`;

export const StrokeCountAreaChart = (): JSX.Element => {
  // Set providers here
  const machineIssuesProviderSettings = {
    pollingInterval: 60000,
    machineType: MachineType.Avure,
    alertStatus: AlertStatus.NotComplete,
    isAlarms: false,
    isAlerts: true,
    isMachineAlerts: false
  };

  return (
    <MachineIssuesProvider {...machineIssuesProviderSettings}>
      {/* intensifier provider here */}
      <StrokeCountContainer>
        <SkidStrokeCountsChartsWrapper />
      </StrokeCountContainer>
      {/* end intensifier provider here */}
    </MachineIssuesProvider>
  );
};
