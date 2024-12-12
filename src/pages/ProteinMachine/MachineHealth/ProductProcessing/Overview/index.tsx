// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

// Components
import {
  IssuesCard,
  ConfiguredMatrixWidgetGroup,
  ConfiguredKPICard,
  ConfiguredStateOverTimeCard
} from 'components/machine-health';

// Types
import { ProteinMachineRouteQueryParams, MachineHealthSubTabs, WidgetType } from 'types/protein';
import { AlarmLocation } from 'types/machine-health/alarms';
import { AlertConfigAlertLocation, AlertLocation } from 'types/machine-health/alerts';

// Constants
import breakpoint from 'constants/breakpoints';
import { widgetTypeToLabelSuffixMap } from 'constants/machineConfig';

// Context providers
import { DateProvider } from 'providers';

interface Props {
  startTime: Date;
  endTime: Date;
}

// Styled Components
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

  return (
    <DateProvider context={{ startTime, endTime }}>
      <Container>
        <TopCards>
          <ConfiguredKPICard
            label={`${MachineHealthSubTabs.PPOverview}_${
              widgetTypeToLabelSuffixMap[WidgetType.KpiCard]
            }`}
            machineId={machineId}
          />
          <IssuesCard
            alarmsLocation={AlarmLocation.PP}
            alertsLocation={AlertLocation.ProductProcessing}
            machineAlertsLocation={AlertConfigAlertLocation.ProductProcessing}
            machineId={machineId}
            startTime={startTime}
            endTime={endTime}
          />
        </TopCards>
        <ConfiguredMatrixWidgetGroup
          label={`${MachineHealthSubTabs.PPOverview}_${
            widgetTypeToLabelSuffixMap[WidgetType.MatrixWidgetGroup]
          }`}
          machineId={machineId}
        />
        <ConfiguredStateOverTimeCard
          machineId={machineId}
          startDatetime={startTime}
          endDatetime={endTime}
          label={`${MachineHealthSubTabs.PPOverview}_${
            widgetTypeToLabelSuffixMap[WidgetType.DurationChart]
          }`}
        />
      </Container>
    </DateProvider>
  );
};

export default Overview;
