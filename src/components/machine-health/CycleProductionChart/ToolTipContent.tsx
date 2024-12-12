// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Typography } from 'components';

export interface Props {
  label: string;
  day: string; // Expected to be of a format that can be parsed by Date
  count: number;
}

const Container = styled.div`
  padding: 1rem;
  max-width: 12rem;
`;

/**
 * Component to render content inside a tooltip
 */
const ToolTipContent = ({ label, day, count }: Props): JSX.Element => (
  <Container>
    <Typography mb="0.5rem" size="0.75rem" weight="bold">
      {label}
    </Typography>
    <Typography weight="bold" mb="0.5rem" size="0.75rem">
      {count}
    </Typography>
    <Typography color="darkGrey2" mb="0.5rem" size="0.75rem">
      {day}
    </Typography>
  </Container>
);

export default ToolTipContent;
