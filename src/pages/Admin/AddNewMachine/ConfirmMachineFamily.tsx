import { Typography } from 'components';
import React from 'react';
import styled from 'styled-components';
import { SalesforceMachine } from 'types/salesforce';

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;

interface Props {
  machine: SalesforceMachine | null;
}

export function ConfirmMachineFamily({ machine }: Props): JSX.Element {
  return (
    <Container>
      <Typography variant="h2">Coming Soon: {machine?.machineName}</Typography>
    </Container>
  );
}
