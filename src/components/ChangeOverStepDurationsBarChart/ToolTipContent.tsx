// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Typography } from 'components';

// Helpers
import { formatDate, formatDuration } from 'helpers';

export interface Props {
  label: string;
  date: Date;
  duration: number;
  timeZone?: string;
}

const Container = styled.div`
  padding: 1rem;
  max-width: 12rem;
`;

/**
 * Component to render content inside a tooltip
 */
const ToolTipContent = ({ label, date, duration, timeZone }: Props): JSX.Element => (
  <Container>
    <Typography mb="0.5rem" size="0.75rem" weight="bold">
      {label}
    </Typography>
    <Typography size="0.75rem" mb={0}>
      Duration: (hh:mm:ss)
    </Typography>
    <Typography mb="0.5rem" size="1rem">
      {formatDuration(duration, 'hours:mins:secs')}
    </Typography>
    <Typography color="darkGrey2" mb="0.5rem" size="0.75rem">
      {formatDate(date, 'long', timeZone)}
    </Typography>
  </Container>
);

export default ToolTipContent;
