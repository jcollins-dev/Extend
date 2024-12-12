// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { KPICard, Typography, Row } from 'components';
import { useContainerSize } from 'hooks';
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';

// Theme
import SingleValueCard from 'components/KPICard/SingleValueCard';
import DataRenderer from 'components/machine-health/DataRenderer';

// Styling
const UtilityMetricContainer = styled.div`
  height: 15.8rem;
  width= 100%;
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 0 auto;
`;

const StyledHeader = styled.div`
  width: 100%;
  & div:first-of-type,
  h4 {
    line-height: 1.125rem;
    padding: 0;
    margin: 0;
    text-align: left;
  }
`;

const headerRenderer = (heading?: string) => {
  return (
    <StyledHeader>
      <CardRow>
        <Cell>
          <CardRow>
            <Cell>
              <Typography mb={0} size="1rem" weight="bold">
                {heading}
              </Typography>
            </Cell>
          </CardRow>
        </Cell>
        <Cell />
      </CardRow>
    </StyledHeader>
  );
};

interface Props {
  waitTimeValue?: string;
  isLoading?: boolean;
  error?: unknown;
}

const WaitTimeWidget = ({ waitTimeValue, isLoading = false }: Props): JSX.Element => {
  const { containerRef: headerRef } = useContainerSize();
  const { t } = useTranslation(['mh']);

  return (
    <DataRenderer isLoading={isLoading}>
      <KPICard
        component={headerRenderer(t('wait_time') as string)}
        ref={headerRef}
        height="20.68rem"
      >
        <UtilityMetricContainer>
          <Row>
            <Cell>
              <SingleValueCard value1={{ value: waitTimeValue, unit: t('duration_h') as string }} />
            </Cell>
          </Row>
        </UtilityMetricContainer>
      </KPICard>
    </DataRenderer>
  );
};

export default WaitTimeWidget;
