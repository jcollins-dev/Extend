// 3rd party libraries
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// Types
import { MachineBusinessUnit } from 'types';
import { StockError, LeadTimeError, PriceError } from 'types/parts';

// Components
import { Typography, Button } from 'components';
import { useTranslation } from 'react-i18next';

export const PartInfoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const PartInfo = styled.div`
  max-width: 28rem;
  padding: 0 1rem;
`;

export const CompatibleLabel = styled.span`
  color: ${({ theme }) => theme.colors.onTrackGreen};
  font-weight: bold;
`;

export const DiscontinuedLabel = styled.span`
  color: ${({ theme }) => theme.colors.darkRed};
  font-weight: bold;
`;

export const StandardPrice = styled.span`
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.mediumGrey1};
  margin-right: 1rem;
`;

export const OrderInputs = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
  max-width: 21rem;
`;

export const QuantityContainer = styled.div`
  width: 6rem;
  margin-right: 1rem;
`;

export const OptionContainer = styled.div`
  flex: 1;
`;

export const PurchaseButtons = styled.div`
  display: flex;
  max-width: 21rem;
  margin-bottom: 1rem;
  * + * {
    margin-left: 1rem;
  }
`;

export const BuyItNowButton = styled(Button)`
  width: auto;
`;

const ContactRow = styled.div`
  margin-bottom: 1.25rem;

  > * + * {
    margin-left: 0.5rem;
  }

  a {
    text-decoration: none;
  }
`;

interface PartDataErrorContactProps {
  stockError?: StockError;
  priceError?: PriceError;
  leadtimeError?: LeadTimeError;
  showContactInfo: boolean;
  businessUnit?: MachineBusinessUnit;
}
export function PartDataErrorContact({
  stockError,
  priceError,
  leadtimeError,
  showContactInfo,
  businessUnit
}: PartDataErrorContactProps): JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation(['fpns']);

  let errorType = '';
  if (stockError) {
    errorType = t('stock');
  } else if (priceError) {
    errorType = t('price');
  } else if (leadtimeError) {
    errorType = t('lead_time');
  }

  let phone;
  let email;
  if (businessUnit === 'avure') {
    phone = '+1.513.433.2496';
    email = 'sparesHPP@jbtc.com';
  } else if (businessUnit === 'pna') {
    phone = '+1.866.JBT.4YOU';
    email = 'naparts@jbtc.com';
  }

  return (
    <>
      <Typography mb="0.5rem" weight="bold" color="darkRed">
        {t('information_unavailable_this_time', { item: errorType })}
      </Typography>
      {showContactInfo && (
        <>
          <Typography color="darkGrey" weight="bold" mb="0.5rem">
            {t('contact_jbt_for_more_information')}
          </Typography>
          <ContactRow>
            {phone && (
              <>
                <FontAwesomeIcon color={theme.colors.darkGrey} icon={faPhone} />
                <Typography color="darkGrey" mb="0.3rem" as="a" href={`tel:${phone}`}>
                  {phone}
                </Typography>
              </>
            )}
            {email && (
              <>
                <FontAwesomeIcon color={theme.colors.darkGrey} icon={faEnvelope} />
                <Typography color="darkGrey" mb="0.5rem" as="a" href={`mailto:${email}`}>
                  {email}
                </Typography>
              </>
            )}
          </ContactRow>
        </>
      )}
    </>
  );
}
