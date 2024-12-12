// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

// Components
import { Typography } from 'components';

export interface ToolTipLine {
  id: string;
  label: string;
  percent: number;
  duration: number;
}

interface Props {
  lines: ToolTipLine[];
}

const Container = styled.div`
  padding: 1rem;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;

  *:first-child {
    margin-right: 0.5rem;
  }
`;

/**
 * Component to render content inside a tooltip
 */
const ToolTipContent = ({ lines }: Props): JSX.Element => (
  <Container>
    {lines.map((line) => (
      <Line key={line.id}>
        <Typography mb={0} size="0.75rem" as="span" weight="bold">
          {line.label}
        </Typography>
        <Typography mb={0} size="0.75rem" as="span">
          {moment.duration(line.duration).asHours().toFixed(1)} ({line.percent.toFixed(1)}%)
        </Typography>
      </Line>
    ))}
  </Container>
);

export default ToolTipContent;
