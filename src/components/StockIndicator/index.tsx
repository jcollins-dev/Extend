import { Indicator, Typography } from 'components';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { LONG_LEAD_TIME_THRESHOLD, LOW_STOCK_THRESHOLD } from 'constants/parts';

import theme from 'themes';
import { Product } from 'types/parts';
import { getCanonicalLeadTimeText, getStockText } from 'helpers';

export const StockIndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1.25rem;
`;

const StyledIndicator = styled(Indicator)`
  display: inline;
  margin: 0 0.875rem 0 0;
  font-weight: 500;
  line-height: inherit; // remove line height setting from Indicator
`;

const LeadTimeTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LeadTimeText = styled.span`
  width: 100%;
  > p {
    margin: 0;
  }
`;

export interface StockIndicatorProps {
  purchasable: Product | undefined;
}

export function getLeadTimeTextComponent(
  part: Product | undefined,
  t: TFunction<'fpns'[], undefined>
): JSX.Element {
  if (part === undefined || part.leadTime === undefined) {
    return <span style={{ color: theme.colors.negativeRed4 }}>Lead time unavailable.</span>;
  }
  const inStock = part?.stock > 0;
  const leadTime = part.leadTime;
  const innerLeadTimeElement = (
    <>
      <span>
        <LeadTimeText
          style={{
            color:
              inStock || (leadTime !== undefined && leadTime + 2 < LONG_LEAD_TIME_THRESHOLD)
                ? theme.colors.onTrackGreen
                : theme.colors.negativeRed
          }}
        >
          <Typography variant="body1">{getCanonicalLeadTimeText(part, t)}</Typography>
        </LeadTimeText>
      </span>

      {!inStock && (
        <Typography variant="body2">{t('call_for_availability', { ns: 'common' })}</Typography>
      )}
    </>
  );

  return <LeadTimeTextContainer>{innerLeadTimeElement}</LeadTimeTextContainer>;
}

function getIndicatorColor(stock: number | undefined): string {
  if (stock === undefined) {
    return theme.colors.negativeRed;
  } else if (stock < LOW_STOCK_THRESHOLD && stock > 0) {
    return theme.colors.atRiskYellow;
  } else if (stock <= 0) {
    return theme.colors.negativeRed;
  }
  return theme.colors.onTrackGreen;
}

const StockIndicator = ({ purchasable }: StockIndicatorProps): ReactElement => {
  const stock = purchasable?.stock;
  const { t } = useTranslation(['fpns']);
  return (
    <StockIndicatorContainer>
      <StyledIndicator color={getIndicatorColor(stock)}>
        {t(getStockText(purchasable))}
      </StyledIndicator>
      {purchasable?.leadTime !== undefined && getLeadTimeTextComponent(purchasable, t)}
    </StockIndicatorContainer>
  );
};

export default StockIndicator;
