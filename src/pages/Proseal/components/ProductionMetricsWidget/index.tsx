// 3rd party libs
import React, { ReactElement } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Component
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';
import { KPICard, Typography } from 'components';

// Theme
import theme from 'themes';
import styled from 'styled-components';

import { formatDecimal } from 'helpers';

// Constants
import breakpoint from 'constants/breakpoints';
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
    padding: 0;
    margin: 0;
    text-align: left;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
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

interface ProductionMetricsProps {
  packCount?: BaseTag;
  feedFactor?: BaseTag;
}

const renderer = (label: string, value: string, t: TFunction<'mh'[], undefined>) => {
  return (
    <Value>
      {value}
      <br />
      <Label>{t(label)}</Label>
      <br />
      <Label>{t('as_of_now')}</Label>
    </Value>
  );
};

const ProductionMetricsWidget = ({
  packCount,
  feedFactor
}: ProductionMetricsProps): ReactElement => {
  const { t } = useTranslation(['mh']);
  return (
    <Card
      component={
        <StyledHeader>
          <CardRow>
            <Cell>
              <Typography color="darkGrey" mb="0.625rem" weight={'bold'}>
                {t('production_metrics')}
              </Typography>
            </Cell>
            <StyledIcon color={theme.colors.darkGrey} icon={faAngleRight} />
          </CardRow>
        </StyledHeader>
      }
    >
      <Content>
        <div>
          {renderer('todays_pack_count', formatDecimal(Number(packCount?.value?.value)), t)}
          {renderer(
            'feed_factor',
            feedFactor
              ? formatDecimal(Number(feedFactor.value?.value), { minimumSignificantDigits: 2 })
              : t('not_enabled'),
            t
          )}
        </div>
      </Content>
    </Card>
  );
};

export default ProductionMetricsWidget;
