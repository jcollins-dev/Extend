// 3rd party
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import moment from 'moment';

// Components
import { Loader, Typography } from 'components';
import { useCart } from 'selectors';
import { toast } from 'react-toastify';

// Hooks
import { useTranslation } from 'react-i18next';

// Styling
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 2.75rem 1.625rem 2.5rem 2.375rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 6.25rem;
`;

const Overview = styled.div`
  width: 100%;
  margin-bottom: 2.375rem;
  display: flex;
`;

const FileLogo = styled.img`
  width: 2.9375rem;
  height: 2.9375rem;
  object-fit: contain;
  margin-right: 0.6875rem;
`;

const OverviewDetails = styled.div`
  height: 100%;

  p {
    margin-bottom: 0;
    padding-bottom: 0.3125rem;
  }
`;

const FileContainer = styled.div`
  width: 100%;
  flex-grow: 1;
`;

// Props
interface Props {
  orderId?: string;
  orderUrl?: string;
}

const CartOrderReview = ({ orderId, orderUrl }: Props): ReactElement => {
  const cart = useCart();
  const { t } = useTranslation(['fpns']);
  if (cart && cart.items.length > 0) {
    toast.warn(t('warning_order_quote'), {
      autoClose: 30000,
      toastId: 'warning-order-quote',
      hideProgressBar: false,
      style: { width: '500px' }
    });
  }
  return orderUrl ? (
    <Container>
      <Overview>
        <FileLogo src="/assets/imgs/pdf-logo.svg" />
        <OverviewDetails>
          <Typography variant="subtitle">{t('parts_quote', { item: orderId || '' })}</Typography>
          <Typography variant="body2">{moment().format('MMM DD, YYYY')}</Typography>
        </OverviewDetails>
      </Overview>
      <FileContainer>
        <iframe src={`${orderUrl}#zoom=FitH`} width="100%" height="100%" />
      </FileContainer>
    </Container>
  ) : (
    <Loader />
  );
};

export default CartOrderReview;
