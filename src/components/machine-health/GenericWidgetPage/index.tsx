// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

// Components
import { ConfiguredMatrixWidgetGroup } from 'components/machine-health';

// Types
import {
  MachineHealthSubTabs,
  MachinePerformanceSubTabs,
  ProteinMachineRouteQueryParams,
  WidgetType
} from 'types/protein';

// Constants
import { widgetTypeToLabelSuffixMap } from 'constants/machineConfig';

// Providers
import { DateProvider } from 'providers';

interface Props {
  endTime: Date;
  pageTemplateId: MachineHealthSubTabs | MachinePerformanceSubTabs;
  startTime: Date;
}

const Container = styled.div`
  padding: 0 3.25rem 1.5625rem;
`;

/**
 * Re-useable page template which is used within Product Movement and Product Processing pages, for "deep dive"
 * pages, whch simply need to render a collection of widget groups (i.e. it has no bespoke content)
 */
const GenericWidgetPage = ({ pageTemplateId, startTime, endTime }: Props): JSX.Element => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  return (
    <DateProvider context={{ startTime, endTime }}>
      <Container>
        <ConfiguredMatrixWidgetGroup
          label={`${pageTemplateId}_${widgetTypeToLabelSuffixMap[WidgetType.MatrixWidgetGroup]}`}
          machineId={machineId}
        />
      </Container>
    </DateProvider>
  );
};

export default GenericWidgetPage;
