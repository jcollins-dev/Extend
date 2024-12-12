// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Typography } from 'components';

// Helpers
import { formatDate, formatDuration } from 'helpers';

export interface Props {
  label: string;
  startTime: Date;
  endTime: Date;
}

const Container = styled.div`
  padding: 1rem;
  max-width: 12rem;
`;

/**
 * Component to render content inside a tooltip
 */
const ToolTipContent = ({ label, startTime, endTime }: Props): JSX.Element => (
  <Container>
    <Typography mb="0.5rem" size="0.75rem" weight="bold">
      {label}
    </Typography>
    <Typography size="0.75rem" mb={0}>
      Duration: (hh:mm:ss)
    </Typography>
    <Typography mb="0.5rem" size="1rem">
      {formatDuration(endTime.getTime() - startTime.getTime(), 'hours:mins:secs')}
    </Typography>
    <Typography color="darkGrey2" mb="0.5rem" size="0.75rem">
      {formatDate(startTime, 'long')}
    </Typography>
  </Container>
);

export default ToolTipContent;
