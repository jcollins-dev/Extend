// 3rd party libs
import React, { ReactElement, useMemo } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Component
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';
import { KPICard, Typography, Indicator } from 'components';

// Theme
import theme from 'themes';
import styled from 'styled-components';

// Constants
import breakpoint from 'constants/breakpoints';

import { formatPercentage } from 'helpers';
import { BaseTag } from 'types/proseal';

const Card = styled(KPICard)`
  flex: 1;
  max-height: 13rem;
`;

const StyledHeader = styled.div`
  width: 100%;
  & div:first-of-type,
  h4 {
    line-height: 1.125rem;
    margin: 0;
    padding: 0;
    text-align: left;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-top: 1rem;
  margin-right: -1rem;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 1rem;
  > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: end;
    flex-wrap: wrap;
  }
`;

const Label = styled.span`
  flex: 1;
  text-align: center;
  line-height: 1.125rem;
  font-weight: 400;
  font-size: 0.8125rem;
  color: ${theme.colors.darkGrey2};
`;

const Value = styled.span<{ weight?: number }>`
  flex: 1;
  text-align: center;
  line-height: 1.5rem;
  font-weight: ${({ weight }) => weight};
  font-size: 1.3125rem;
  @media (max-width: ${breakpoint.size.md}px) {
    font-size: 1rem;
  }
`;

interface OEEWidgetProps {
  availabilityRate?: BaseTag;
  performanceRate?: BaseTag;
}

const renderer = (label: string, value: string, t: TFunction<'mh'[], undefined>) => {
  return (
    <Value>
      {value}
      <br />
      <Label>{t(label)}</Label>
      <br />
      <Label>{t('last_4_hours')}</Label>
    </Value>
  );
};

/** Replace this with actual value when pulled in */
const MOCK_OEE_THRESHOLD = 0.5;

const OEEWidget = ({ availabilityRate, performanceRate }: OEEWidgetProps): ReactElement => {
  const oee: number = useMemo((): number => {
    return Number(availabilityRate?.value?.value) * Number(performanceRate?.value?.value);
  }, [availabilityRate, performanceRate]);

  const statusColor = useMemo(() => {
    return oee >= MOCK_OEE_THRESHOLD ? theme.colors.onTrackGreen : theme.colors.negativeRed;
  }, [oee]);

  const { t } = useTranslation(['mh']);

  return (
    <Card
      component={
        <StyledHeader>
          <CardRow>
            <Cell>
              <CardRow>
                <Cell>
                  <Typography color="darkGrey" size="0.8125rem" mb="0.625rem" weight="bold">
                    {t('oee')}
                  </Typography>
                  <CardRow>
                    <Indicator color={statusColor} />
                    <Typography color={statusColor} size="1.25rem" weight="bold" mb="0.3125rem">
                      {formatPercentage(oee)}
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
        <div>
          {renderer(
            'availability_rate',
            formatPercentage(Number(availabilityRate?.value?.value)),
            t
          )}
          {renderer('performance_rate', formatPercentage(Number(performanceRate?.value?.value)), t)}
        </div>
      </Content>
    </Card>
  );
};

export default OEEWidget;
