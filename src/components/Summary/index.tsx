// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Card, Typography } from 'components';

type Data = { [key in string]: string | string[] };
type Props = {
  title: string;
  data: Data;
};

const Label = styled.div``;
const Value = styled.div``;

const SummaryBlock = styled.div`
  display: flex;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0em;
  text-align: left;

  ${Label} {
    flex-basis: 33.33%;
  }
  ${Value} {
    flex-basis: 66.66%;
    display: flex;
    flex-direction: column;
  }
`;

const valueRenderer = (value: string | string[]) => {
  if (!Array.isArray(value)) return <Value>{value}</Value>;
  return (
    <Value>
      {value.map((v) => {
        return <li key={v}>{v}</li>;
      })}
    </Value>
  );
};

const summaryRenderer = (data: Data) => {
  return (
    <>
      {Object.keys(data).map((label, i) => {
        return (
          <SummaryBlock key={`${i}-${label}`}>
            <Label>{label}</Label>
            <Value>{valueRenderer(data[label])}</Value>
          </SummaryBlock>
        );
      })}
    </>
  );
};

const Summary = ({ title, data }: Props): JSX.Element => {
  return (
    <Card>
      <Card.Header>
        <Typography as="h3" mb={0} size="1.125rem" weight="bold">
          {title}
        </Typography>
      </Card.Header>
      <Card.Body pt={0}>{summaryRenderer(data)}</Card.Body>
    </Card>
  );
};

export default Summary;
