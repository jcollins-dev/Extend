import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { currency } from 'helpers';
import { PriceError, PurchasableItem } from 'types/parts';
import { Typography } from 'components';
import { Link } from 'react-router-dom';
import { JBTRoutes } from 'constants/routes';
import { useDispatch } from 'react-redux';
import { helpActions } from 'actions';

export const StandardPrice = styled.div`
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.mediumGrey1};
  margin-right: 1rem;
`;

interface Props {
  product: PurchasableItem;
  fontSizeInREM?: number | undefined;
  marginBottomInREM?: number | undefined;
  inline?: boolean;
  bold?: boolean;
  handleClose?: () => void;
}

const InlineCustomerPrice = styled.div`
  display: flex;
  flex-direction: row;
  white-space: normal;
`;

const CustomerPrice = ({
  product,
  handleClose,
  fontSizeInREM,
  marginBottomInREM,
  inline,
  bold
}: Props): ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['fpns']);
  const hasPriceError =
    product.priceError !== undefined &&
    product.priceError !== null &&
    product.priceError !== PriceError.NONE;
  const priceClickHandler = () => {
    dispatch({
      type: helpActions.ADD_HELP_MESSAGE,
      helpMessage: `Sku: ${product.sku} Description: ${product.description}`
    });
    if (handleClose) {
      handleClose();
    }
  };
  return (
    <Typography
      size={`${fontSizeInREM !== undefined ? fontSizeInREM : 1.3125}rem`}
      weight={`${bold !== undefined ? 'bold' : 'normal'}`}
      mb={`${marginBottomInREM !== undefined ? marginBottomInREM : 1.25}rem`}
      as="span"
    >
      {!hasPriceError && product.price && product.custPrice && product.custPrice > 0
        ? drawCustomerPrice(inline, product, product.price, product.custPrice, priceClickHandler, t)
        : drawProductPriceOrContactJBT(hasPriceError, product, priceClickHandler, t)}
    </Typography>
  );
};

export default CustomerPrice;

function drawCustomerPrice(
  inline: boolean | undefined,
  product: PurchasableItem,
  price: number,
  customerPrice: number,
  priceClickHandler: () => void,
  t: TFunction<'fpns'[], undefined>
): React.ReactNode {
  return product.isPurchasable ? (
    inline ? (
      <InlineCustomerPrice>
        <StandardPrice>{currency(price, product.priceUnit)}</StandardPrice>
        <b>{` ${currency(customerPrice, product.priceUnit)}`}</b>
      </InlineCustomerPrice>
    ) : (
      <>
        <StandardPrice>{currency(price, product.priceUnit)}</StandardPrice>
        {` ${currency(customerPrice, product.priceUnit)}`}
      </>
    )
  ) : (
    <Link onClick={priceClickHandler} to={JBTRoutes.help}>
      <InlineCustomerPrice>
        {t('contact_jbt_for_price', { ns: ['fpns', 'common'] })}
      </InlineCustomerPrice>
    </Link>
  );
}

function drawProductPriceOrContactJBT(
  hasPriceError: boolean,
  product: PurchasableItem,
  priceClickHandler: () => void,
  t: TFunction<'fpns'[], undefined>
): React.ReactNode {
  return !hasPriceError && product.price && product.price > 0 && product.isPurchasable ? (
    currency(product.price, product.priceUnit)
  ) : (
    <Link onClick={priceClickHandler} to={JBTRoutes.help}>
      <InlineCustomerPrice>
        {t('contact_jbt_for_price', { ns: ['fpns', 'common'] })}
      </InlineCustomerPrice>
    </Link>
  );
}
