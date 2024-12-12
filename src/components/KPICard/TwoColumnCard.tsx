// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Typography } from 'components';
import { Value, Cell } from './CardComponents';

interface Props {
  values: Value[];
}

const Container = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
`;

const HalfCell = styled(Cell)`
  flex: 1 1 50%;
  padding: 0.5rem;
`;

const TwoColumnCard = ({ values }: Props): JSX.Element => (
  <Container>
    {values.map((value, index) => (
      <HalfCell key={`${value.key}${index}`}>
        {value.valueTitle && (
          <Typography
            mb={value.mb ?? '0.625rem'}
            color="mediumGrey2"
            size={value.unitSize ?? '0.8125rem'}
          >
            {value.valueTitle}
          </Typography>
        )}
        <Typography
          mb={value.mb ?? '0.625rem'}
          size={value.size ?? '1rem'}
          weight={value.weight ?? 'bold'}
          color={value.color ?? 'darkGrey'}
        >
          {value.value}
        </Typography>
        <Typography mb={0} color="mediumGrey2" size={value.unitSize ?? '0.8125rem'}>
          <span style={{ color: value.unitTitleColor }}> {value.unitTitle}</span> {value.unit}
        </Typography>
      </HalfCell>
    ))}
  </Container>
);

export default TwoColumnCard;
