import React from 'react';
import { Part } from 'types/parts';
import { Typography } from 'components';
import { truncatePartSKU } from 'helpers/part';
import styled from 'styled-components';

import { TextContainer } from './index';

const PartTitle = styled(Typography)`
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
`;

const GrayTextContainer = styled((props) => <TextContainer {...props} />)`
  background-color: ${({ theme }) => theme.colors.lightGrey2};
`;

const GrayText = styled(Typography)`
  color: ${({ theme }) => theme.colors.mediumGrey3};
  font-size: 1rem;
`;

const DiscontinuedPart = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  margin: 0.75rem -1.25rem 0.75rem -1.25rem;
  padding: 1.25rem 1.25rem 0 1.25rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey3};
`;

const DiscontinueContainer = styled(Typography)`
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.4rem;
`;

const Discontinued = styled(DiscontinueContainer)`
  background-color: ${({ theme }) => theme.colors.negativeRed4};
`;

const DiscontinuedText = styled(Typography)`
  color: ${({ theme }) => theme.colors.darkRed};
  font-size: 1rem;
`;

const PartTitleInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

export function PreviewCardDiscontinuedPart(part: Part, partDisplayName: string): JSX.Element {
  return (
    <DiscontinuedPart>
      <PartTitleInfo>
        <Discontinued>
          <DiscontinuedText as="span">Discontinued</DiscontinuedText>
        </Discontinued>
        <GrayTextContainer>
          <GrayText as="span">{`JBT #${truncatePartSKU(part.stockCode || part.sku, 16)}`}</GrayText>
        </GrayTextContainer>
      </PartTitleInfo>
      <PartTitle variant="h2">{partDisplayName}</PartTitle>
      {/* <Typography mb="1.25rem">{`Customer #${part.customerPartId || 'N/A'}`}</Typography> */}
    </DiscontinuedPart>
  );
}
