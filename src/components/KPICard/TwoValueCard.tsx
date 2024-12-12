import React from 'react';
import { Typography } from 'components';
import { Value, Row, Cell } from './CardComponents';

interface Props {
  value1: Value;
  value2: Value;
}

const TwoValueCard = ({ value1, value2 }: Props): JSX.Element => (
  <>
    <Row>
      <Cell>
        <Typography
          mb={value1.mb ?? 0}
          size={value1.size ?? '2.25rem'}
          weight={value1.weight ?? 'bold' }
          color={value1.color ?? 'darkGrey'}
        >
          {value1.value}
        </Typography>
        <Typography mb={0} color="mediumGrey2" size="0.8125rem">
          {value1.unit}
        </Typography>
      </Cell>
    </Row>
    <Row>
      <Cell>
        <Typography
          mb={value2.mb ?? 0}
          size={value2.size ?? '2.25rem'}
          weight={value2.weight ?? 'bold' }
          color={value2.color ?? 'darkGrey'}
        >
          {value2.value}
        </Typography>
        <Typography mb={0} color="mediumGrey2" size="0.8125rem">
          {value2.unit}
        </Typography>
      </Cell>
    </Row>
  </>
);

export default TwoValueCard;
