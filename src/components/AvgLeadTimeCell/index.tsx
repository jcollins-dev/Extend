// 3rd party
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Types
import { LeadTimeError, Product } from 'types/parts';

// Constants
import { LONG_LEAD_TIME_THRESHOLD } from 'constants/parts';
import breakpoint from 'constants/breakpoints';

// Theme
import theme from 'themes';

// Helpers
import { getCanonicalLeadTimeText } from 'helpers';

type AvgLeadTimeCellProps = {
  purchasable: Product | undefined;
};

// Styling
const LeadTimeContainer = styled.div<AvgLeadTimeCellProps>`
  display: flex;
  color: ${(props) => getCanonicalLeadTimeColoring(props.purchasable)};
  justify-content: left;
  flex-direction: column;
  flex-grow: 1;
  text-align: center;
  width: 10rem;
  @media ${breakpoint.device.xxl} {
    text-align: left;
  }
`;

// only apply the spacing if the icon is going to appear
const LeadTimeIconContainer = styled.div<{
  showIcon: boolean;
}>`
  display: block;
  margin: 0 auto;
  @media ${breakpoint.device.xxl} {
    display: inline-block;
    margin-right: 0.5625rem;
  }
`;

const WrapText = styled.div`
  white-space: normal;
  text-align: center;
  margin-left: 0;
  @media ${breakpoint.device.xxl} {
    text-align: left;
  }
`;

function getCanonicalLeadTimeColoring(purchasable: Product | undefined): string {
  const leadTime = purchasable?.leadTime;
  const inStock = purchasable !== undefined && purchasable.stock > 0;
  if (leadTime !== undefined && leadTime > 0 && inStock) {
    return theme.colors.black;
  }
  return theme.colors.negativeRed;
}

// Component function
const AvgLeadTimeCell = ({ purchasable }: AvgLeadTimeCellProps): ReactElement => {
  const { t } = useTranslation(['fpns']);
  const leadTimeValid =
    purchasable?.leadTimeError === undefined || purchasable.leadTimeError === LeadTimeError.NONE;
  const leadTime = purchasable?.leadTime;
  const inStock = purchasable !== undefined && purchasable.stock > 0;
  const showIcon =
    (leadTimeValid && leadTime !== undefined && leadTime > LONG_LEAD_TIME_THRESHOLD) || !inStock;
  return (
    <LeadTimeContainer purchasable={purchasable}>
      <WrapText>
        {showIcon && (
          <LeadTimeIconContainer showIcon={showIcon}>
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </LeadTimeIconContainer>
        )}
        {getCanonicalLeadTimeText(purchasable, t)}
      </WrapText>
      {(!inStock || leadTime === 0 || leadTime === undefined) && (
        <>{t('call_for_availability', { ns: 'common' })}</>
      )}
    </LeadTimeContainer>
  );
};

export default AvgLeadTimeCell;
