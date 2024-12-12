// 3rd party libs
import React, { ReactElement, useMemo } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

// Component
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';
import { KPICard, Typography, Indicator } from 'components';

// Theme
import theme from 'themes';
import styled from 'styled-components';

// Constants
import breakpoint from 'constants/breakpoints';

const Card = styled(KPICard)`
  flex: 1;
  max-height: 15rem;
`;

const StyledHeader = styled.div`
  width: 100%;
  & div:first-of-type,
  h4 {
    line-height: 1rem;
    margin: 0;
    padding: 0;
    text-align: left;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-top: 1rem;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Row = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
`;

const Value = styled.span<{ weight?: number }>`
  flex: 1;
  text-align: left;
  line-height: 1.5rem;
  font-weight: ${({ weight }) => weight};
  font-size: 1rem;
  @media (max-width: ${breakpoint.size.md}px) {
    font-size: 0.8125rem;
  }
`;

const Line = styled.div`
  background-color: #c2c2c2;
  height: 0.0625rem;
  width: 100%;
`;

interface MachineStatusWidgetProps {
  currentStatus: string;
  currentRecipe?: string;
  jobNumber?: string;
}

const MachineStatusWidget = ({
  currentStatus,
  currentRecipe,
  jobNumber
}: MachineStatusWidgetProps): ReactElement => {
  const { t } = useTranslation(['mh']);
  const statusColor = useMemo(() => {
    switch (currentStatus) {
      case 'Running':
        return theme.colors.onTrackGreen;
      default:
        return theme.colors.negativeRed;
    }
  }, [currentStatus]);

  return (
    <Card
      component={
        <StyledHeader>
          <CardRow>
            <Cell>
              <CardRow>
                <Cell>
                  <Typography color="darkGrey" size="0.8125rem" mb="0.625rem">
                    {t('machine_status')}
                  </Typography>
                  <CardRow>
                    <Indicator color={statusColor} />
                    <Typography color={statusColor} size="1.25rem" weight="bold" mb="0.3125rem">
                      {currentStatus}
                    </Typography>
                  </CardRow>
                </Cell>
              </CardRow>
            </Cell>
            <Cell />
            <StyledIcon color={theme.colors.darkGrey} icon={faAngleRight} />
          </CardRow>
        </StyledHeader>
      }
    >
      <Content>
        <Row>
          <Value weight={600}>{t('recipe')}</Value>
          <Value>{currentRecipe}</Value>
        </Row>
        <Line />
        <Row>
          <Value weight={600}>{t('job_number')}</Value>
          <Value>{jobNumber || '-'}</Value>
        </Row>
      </Content>
    </Card>
  );
};

export default MachineStatusWidget;
