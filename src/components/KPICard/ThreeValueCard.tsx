import React from 'react';
import { Typography } from 'components';
import { Value, Row, Cell } from './CardComponents';

interface Props {
  value1: Value;
  value2: Value;
  value3: Value;
}

const ThreeValueCard = ({ value1, value2, value3 }: Props): JSX.Element => (
  <>
    <Row>
      <Cell>
        <Typography
          mb={value1.mb ?? 0}
          size={value1.size ?? '2.25rem'}
          weight={value1.weight ?? 'bold'}
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
          mb={value2.mb ?? '0.625rem'}
          size={value2.size ?? '1.3125rem'}
          color={value2.color ?? 'darkGrey'}
          weight={value3.weight ?? 'normal'}
        >
          {value2.value}
        </Typography>
        <Typography mb={0} color="mediumGrey2" size="0.8125rem">
          {value2.unit}
        </Typography>
      </Cell>
      <Cell>
        <Typography
          mb={value2.mb ?? '0.625rem'}
          size={value3.size ?? '1.3125rem'}
          color={value3.color ?? 'darkGrey'}
          weight={value3.weight ?? 'normal'}
        >
          {value3.value}
        </Typography>
        <Typography mb={0} color="mediumGrey2" size="0.8125rem">
          {value3.unit}
        </Typography>
      </Cell>
    </Row>
  </>
);

export default ThreeValueCard;
