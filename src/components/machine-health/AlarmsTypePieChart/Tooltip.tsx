// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Typography } from 'components/index';

interface Props {
  label: string;
  count: number;
  percent: number;
}

const Container = styled.div`
  padding: 1rem;
`;

/**
 * Component to render content inside a tooltip
 */
const ToolTip = ({ label, count, percent }: Props): JSX.Element => (
  <Container>
    <Typography mb={'0.5rem'} size="0.75rem" weight="bold">
      {label}
    </Typography>
    <Typography mb={'0.5rem'} size="0.75rem" weight="bold">
      {count}
    </Typography>
    <Typography mb={'0.5rem'} size="0.75rem">
      {percent.toFixed(2)}%
    </Typography>
  </Container>
);

export default ToolTip;
