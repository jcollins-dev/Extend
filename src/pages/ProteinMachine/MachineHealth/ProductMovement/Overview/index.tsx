// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

// Components
import {
  ConfiguredKPICard,
  ConfiguredMatrixWidgetGroup,
  DriveTorqueRatio,
  IssuesCard,
  ConfiguredStateOverTimeCard
} from 'components/machine-health';

// Types
import { MachineHealthSubTabs, ProteinMachineRouteQueryParams, WidgetType } from 'types/protein';
import { AlarmLocation } from 'types/machine-health/alarms';
import { AlertConfigAlertLocation, AlertLocation } from 'types/machine-health/alerts';

// Constants
import breakpoint from 'constants/breakpoints';
import { widgetTypeToLabelSuffixMap } from 'constants/machineConfig';

// Providers
import { DateProvider, useLanguage } from 'providers';

// API
import { useGetConfiguredWidgetQuery } from 'api';

interface Props {
  startTime: Date;
  endTime: Date;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 3.25rem 1.5625rem;
  gap: 1.5625rem;
`;

const TopCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > div:first-child {
    flex: 1;
  }

  & > div:last-child {
    flex: 2;
  }

  @media ${breakpoint.device.xl} {
    flex-direction: row;
  }
`;

const Overview = ({ startTime, endTime }: Props): JSX.Element => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { languageId } = useLanguage();

  const { data } = useGetConfiguredWidgetQuery({
    machineId,
    labels: [
      `${MachineHealthSubTabs.PMOverview}_${widgetTypeToLabelSuffixMap[WidgetType.RatioChart]}`
    ],
    includeTagValues: true,
    languageId: languageId
  });

  const widgetData = data && data[0];

  return (
    <DateProvider context={{ startTime, endTime }}>
      <Container>
        <TopCards>
          <ConfiguredKPICard
            label={`${MachineHealthSubTabs.PMOverview}_${
              widgetTypeToLabelSuffixMap[WidgetType.KpiCard]
            }`}
            machineId={machineId}
          />
          <IssuesCard
            alarmsLocation={AlarmLocation.PM}
            alertsLocation={AlertLocation.ProductMovement}
            machineAlertsLocation={AlertConfigAlertLocation.ProductMovement}
            machineId={machineId}
            startTime={startTime}
            endTime={endTime}
          />
        </TopCards>
        <ConfiguredMatrixWidgetGroup
          label={`${MachineHealthSubTabs.PMOverview}_${
            widgetTypeToLabelSuffixMap[WidgetType.MatrixWidgetGroup]
          }`}
          machineId={machineId}
        />
        <ConfiguredStateOverTimeCard
          machineId={machineId}
          startDatetime={startTime}
          endDatetime={endTime}
          label={`${MachineHealthSubTabs.PMOverview}_${
            widgetTypeToLabelSuffixMap[WidgetType.DurationChart]
          }`}
        />
        {widgetData?.active && (
          <DriveTorqueRatio machineId={machineId} startTime={startTime} endTime={endTime} />
        )}
      </Container>
    </DateProvider>
  );
};

export default Overview;
