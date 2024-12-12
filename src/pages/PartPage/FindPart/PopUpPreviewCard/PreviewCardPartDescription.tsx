import React from 'react';
import { Part } from 'types/parts';
import { truncatePartSKU } from 'helpers/part';
import styled from 'styled-components';
import { Typography } from 'components';

import { TextContainer } from './index';

const PartThumbnail = styled.img`
  margin-left: auto;
  margin-right: auto;
  display: block;
  align-self: center;
  min-height: 4.875rem;
  min-width: 6.25rem;
  max-height: 6rem;
  max-width: 8rem;
  border-radius: 5px;
`;

const PartTitle = styled(Typography)`
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
`;

const PartTextContainer = styled((props) => <TextContainer {...props} />)<{
  isAlternate?: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.primaryBlue4};
  margin-left: ${({ isAlternate }) => (isAlternate ? '1rem' : '0rem')};
`;

const PartText = styled(Typography)`
  color: ${({ theme }) => theme.colors.mediumBlue};
  font-size: 1rem;
`;

const AlternateContainer = styled(Typography)`
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.4rem;
`;

const Alternate = styled(AlternateContainer)`
  background-color: ${({ theme }) => theme.colors.onTrackGreen5};
`;

const AlternateText = styled(Typography)`
  color: ${({ theme }) => theme.colors.onTrackGreen};
  font-size: 1rem;
`;

const PartTitleInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

export function PreviewCardPartDescription(
  part: Part,
  partImageURL: string | undefined,
  alternatePartsIsFetching: boolean,
  finalPart: Part,
  finalPartDisplayName: string
): JSX.Element {
  return (
    <>
      <PartThumbnail src={partImageURL} />
      <PartTitleInfo>
        {part.alternateSku && !alternatePartsIsFetching && (
          <Alternate>
            <AlternateText as="span">Alternative</AlternateText>
          </Alternate>
        )}
        <PartTextContainer isAlternate={part.alternateSku && !alternatePartsIsFetching}>
          <PartText as="span">{`JBT #${truncatePartSKU(
            finalPart.stockCode || finalPart.sku,
            16
          )}`}</PartText>
        </PartTextContainer>
      </PartTitleInfo>
      <PartTitle variant="h2">{finalPartDisplayName}</PartTitle>
    </>
  );
}
