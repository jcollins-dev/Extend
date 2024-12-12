// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';

// Components
import { Value } from 'components/KPICard/CardComponents';
import { Column, Loader, Row, Typography } from 'components';

// Theme
import theme from 'themes';
import { useGetMachineAssetsQuery } from 'api';

// Types
import { ResourceType } from 'types';

const images = {
  'dce5e9f4-bf5c-4b85-b506-e6183f2cd225': '/assets/placeholder/machines/linear-filler.jpg',
  '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c': '/assets/placeholder/machines/dsi.jpg',
  'cfb8d598-242b-4295-8755-d42227dd2e33': '/assets/placeholder/machines/dsi.jpg',
  'fdb06c9d-d061-42a3-b068-233d3dee99d8': '/assets/placeholder/machines/dsi.jpg'
} as Record<string, string>;

const defaultImage = `/assets/placeholder/machines/dsi.jpg`;

type Props = {
  values?: Value[];
  height?: number;
  containerHeight?: number | string;
  error?: string;
  isLoading?: boolean;
  scroll?: boolean;
  ga?: string;
};

// Styling
const Container = styled.div`
  grid-area: ${({ ga }: Props) => ga};
  border: 0.0625rem solid ${theme.colors.mediumGrey1};
  border-radius: 0.625rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MachineImage = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const KpiContainer = styled.div`
  & > div {
    padding: 0rem 1rem;
    align-items: stretch;
  }
  overflow-y: auto;
  max-height: 26em;
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  align-items: stretch;
  font-weight: 400;
  font-size: 0.8125rem;
  border-top: 1px solid ${theme.colors.mediumGrey1};

  p,
  span {
    flex: 1;
    margin-top: 1rem;
  }
`;

const ActiveRecipeKpiWidget = ({ values, error, isLoading, ga }: Props): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();

  const { data: machineAssets } = useGetMachineAssetsQuery({
    machineId: machineId as string,
    assetType: ResourceType.MachineImage
  });

  const renderInnerValues = (innerValues: Value[]) => {
    return innerValues.map((innerValue: Value, index) => {
      return (
        <Column key={index}>
          <Typography
            size="0.825rem"
            mb={0}
            color={theme.colors.mediumGrey2}
            style={{ marginTop: 0 }}
          >
            {innerValue.unit}
          </Typography>
          <Typography size="0.825rem" mb={0} color={theme.colors.darkGrey} style={{ marginTop: 0 }}>
            {innerValue.value}
          </Typography>
        </Column>
      );
    });
  };
  return (
    <Container className="machine-image-grid" {...{ ga }}>
      <MachineImage>
        <img
          src={
            machineAssets
              ? machineAssets[machineAssets.length - 1].url
              : images[machineId] || defaultImage
          }
          alt={machineId}
        />
      </MachineImage>
      {error && (
        <Typography color="negativeRed" style={{ marginLeft: '2rem', marginTop: '1.5rem' }}>
          {error}
        </Typography>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <KpiContainer>
          {values?.map((valueItem: Value) => (
            <ValueContainer key={valueItem.key} className="value-container">
              <Typography weight="bold" size="0.825rem" color={theme.colors.darkGrey}>
                {valueItem.valueTitle}
              </Typography>
              <Typography as="span">
                {valueItem.values && !isEmpty(valueItem.values) && (
                  <Row>{renderInnerValues(valueItem.values)}</Row>
                )}
                <Typography as="span" size="0.825rem">
                  {valueItem.value}
                </Typography>
              </Typography>
            </ValueContainer>
          ))}
        </KpiContainer>
      )}
    </Container>
  );
};

export default ActiveRecipeKpiWidget;
