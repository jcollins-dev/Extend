import React from 'react';
import { Typography } from 'components';
import { Value, Row, Cell } from './CardComponents';

interface Props {
  value1: Value;
}

const SingleValueCard = ({ value1 }: Props): JSX.Element => (
  <>
    <Row>
      <Cell>
        {value1.valueTitle && (
          <Typography mb={value1.mb ?? '0.625rem'} color="mediumGrey2" size="0.8125rem">
            {value1.valueTitle}
          </Typography>
        )}
        <Typography
          mb={value1.mb ?? 0}
          size={value1.size ?? '2.25rem'}
          weight={value1.weight ?? 'bold'}
          color={value1.color ?? 'darkGrey'}
          className="kpi-card__value"
        >
          {value1.value}
        </Typography>
        <Typography
          mb={0}
          color="mediumGrey2"
          size={value1.unitSize ?? '0.8125rem'}
          className={'kpi-card__unit'}
        >
          {value1.unit}
        </Typography>
      </Cell>
    </Row>
  </>
);

export default SingleValueCard;
