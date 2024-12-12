// 3rd party
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'react-i18next';

// Types
import { UserScopes, WizardFooterProps } from 'types';
import { CartState, SFCartItem } from 'types/parts/cart';
import { PermissionScopeName } from 'types/user-management';

// Providers
import { useLanguage } from 'providers';

// Constants
import { sfEnabled } from 'constants/featureFlags';

// Components
import { Button, Typography, PermissionWrapper } from 'components';
import { useCart } from 'selectors';
import { useDispatch } from 'react-redux';
import { cartActions } from 'actions';
import { currency } from 'helpers';
import { generateAnalyticsEvent } from 'helpers/analytics';
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';
import { useDeleteCartProductsMutation } from 'api';

// Styling
const Footer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  width: 100%;
  height: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 1.3125rem 1.625rem 2.5rem 2.375rem;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  box-shadow: 0 -0.125rem 0.3125rem rgba(0, 0, 0, 0.05);

  display: flex;
`;

const Spacer = styled.div`
  height: 2.5rem;
  flex-basis: 0.625rem;
  flex-grow: 1;
`;

const NextContainer = styled.div`
  display: flex;
  flex-direction: row;
  // width: 8.375rem;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
    margin-left: 1rem;
  }
`;

const BackContainer = styled.div`
  width: 4.75rem;
  height: 2.5rem;
  margin-right: 0.5625rem;
`;

const TotalContainer = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const GrandTotalTextContainer = styled.div`
  p {
    margin: 0;
  }
  height: 2.5rem;
  margin-right: 2rem;
`;

const DownloadCSVContainer = styled.div`
  width: 15rem;
  height: 2.5rem;
  margin-right: 0.5625rem;
  align-self: flex-start;
`;

const DraftPOContainer = styled.div`
  width: 16rem;
  height: 2.5rem;
  margin-right: 0.5625rem;
  align-self: flex-start;
`;

const GrandTotalPriceContainer = styled.div`
  white-space: nowrap;
`;
interface Props {
  stepFooters: WizardFooterProps[];
  onDownloadDraftPO?: () => void;
}

const CartFooter = ({ stepFooters, onDownloadDraftPO }: Props): ReactElement => {
  const cart = useCart() as CartState;
  const dispatch = useDispatch();
  const { t } = useTranslation(['fpns']);
  const { languageId } = useLanguage();
  const { activeStep, isFirstStep, isLastStep, nextStep, previousStep } = useWizard();
  const currentFooter = stepFooters[activeStep];
  const [deleteCartProducts] = useDeleteCartProductsMutation();
  const handleNext = () => {
    if (currentFooter.nextAction) currentFooter.nextAction();
    nextStep();
  };

  const emptyCart = () => {
    if (sfEnabled()) {
      cart.sfCart.cartItems?.map((sfItem: SFCartItem) => {
        deleteCartProducts({ cartItemId: sfItem.cartItem.cartItemId })
          .unwrap()
          .then(() => {
            dispatch({ type: cartActions.EMPTY_CART });
          });
      });
    } else {
      dispatch({ type: cartActions.EMPTY_CART });
    }
  };
  // Adjust to show by multiple currencies.
  // Customers should not see multiple currencies but, putting this
  // logic in so things do not appear broken for cross-region users (i.e. admins)
  const currencyGroups: Record<string, number> = {};
  cart?.items.forEach((itemGroup) => {
    // For now, assume undefined priceUnit/currency defaults to USD
    // for items that do not have a currency from the
    const priceUnit = itemGroup.item.priceUnit || 'USD';
    const price = !itemGroup.item?.isPurchasable
      ? 0
      : (itemGroup.item?.custPrice ? itemGroup.item.custPrice : itemGroup.item.price || 0) *
        itemGroup.quantity;
    if (price) {
      if (Object.prototype.hasOwnProperty.call(currencyGroups, priceUnit))
        currencyGroups[priceUnit] += price;
      else currencyGroups[priceUnit] = price;
    }
  });
  const grandTotal = Object.keys(currencyGroups)
    .map((priceUnit) => {
      return currency(currencyGroups[priceUnit], priceUnit);
    })
    .join(', ');
  return (
    <Footer>
      {activeStep === 0 && (
        <>
          <DownloadCSVContainer>
            <Button
              disabled={cart?.items.length === 0}
              variant="thin"
              onClick={() => {
                dispatch({
                  type: cartActions.DOWNLOAD_CART_CSV,
                  t: t,
                  languageId: languageId
                });
              }}
            >
              {t('download_cart_csv')}
            </Button>
          </DownloadCSVContainer>
          <DraftPOContainer>
            <Button
              disabled={cart?.items.length === 0}
              variant="thin"
              onClick={() => {
                if (onDownloadDraftPO) {
                  onDownloadDraftPO();
                }
              }}
            >
              {t('download_draft_order_quote')}
            </Button>
          </DraftPOContainer>
        </>
      )}
      <Spacer />
      {!isFirstStep && !isLastStep && (
        <BackContainer>
          <Button variant="default" onClick={previousStep}>
            {t(currentFooter.prevText as string) || null}
          </Button>
        </BackContainer>
      )}
      <NextContainer>
        {isFirstStep && (
          <TotalContainer>
            <GrandTotalTextContainer>
              <Typography size="0.8125rem">{t('grand_total')}</Typography>
              <GrandTotalPriceContainer>
                <Typography size="1.5rem">
                  {grandTotal !== '' ? String(grandTotal) : 'N/A'}
                </Typography>
              </GrandTotalPriceContainer>
            </GrandTotalTextContainer>
            <Button disabled={cart?.items.length === 0} variant="default" onClick={emptyCart}>
              {t('clear_quote')}
            </Button>
          </TotalContainer>
        )}
        <PermissionWrapper scope={UserScopes.Write} page={PermissionScopeName.SHOP}>
          <Button
            disabled={currentFooter.continueCondition ? !currentFooter.continueCondition() : false}
            variant="primary"
            onClick={() => {
              if (isFirstStep) {
                generateAnalyticsEvent({
                  category: AnalyticsCategories.ECOMMERCE,
                  action: ECommerceAnalyticEventActions.CHECKOUT_STARTED
                });
              }
              handleNext();
            }}
          >
            {t(currentFooter.nextText, { ns: ['fpns', 'common'] })}
          </Button>
        </PermissionWrapper>
      </NextContainer>
    </Footer>
  );
};

export default CartFooter;
