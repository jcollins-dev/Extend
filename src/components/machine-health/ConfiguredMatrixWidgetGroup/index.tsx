// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { DataRenderer } from 'components/machine-health';
import MatrixWidget from './MatrixWidget';

// Types
import { ConfiguredWidget } from 'types/protein';

// Api
import { useGetConfiguredWidgetQuery } from 'api';

// Providers
import { useLanguage } from 'providers';

interface Props {
  label: string;
  machineId: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5625rem;
`;

/**
 * ConfiguredMatrixWidgetGroup loads data for a particular label id, and then
 * dynamically renders a list of MatrixWidgets from that data.
 */
const ConfiguredMatrixWidgetGroup = ({ label, machineId }: Props): JSX.Element => {
  const { languageId } = useLanguage();
  const { data, isLoading, error } = useGetConfiguredWidgetQuery(
    {
      machineId,
      labels: [label],
      includeTagValues: true,
      languageId: languageId
    },
    {
      pollingInterval: 5000
    }
  );

  let errorMessage;

  if (error) {
    errorMessage = 'Failed to load data';
  }

  // We only expect to return one widget in the response array, otherwise there has been a misconfiguration
  if (data?.length !== 1) {
    errorMessage = 'Widget not found';
  }

  return (
    <Container>
      <DataRenderer loaderMargin="2rem" error={errorMessage} isLoading={isLoading}>
        {data && data.length === 1
          ? data[0].members?.map((matrixWidget: ConfiguredWidget) => (
              <MatrixWidget key={matrixWidget.id} data={matrixWidget} machineId={machineId} />
            ))
          : null}
      </DataRenderer>
    </Container>
  );
};

export default ConfiguredMatrixWidgetGroup;
