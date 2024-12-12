// 3rd party libraries
import React, { ReactElement, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { sum } from 'lodash';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Components
import { Button, CartListComponent, Indicator, Loader, Typography } from 'components';

// State management
import { cartActions } from 'actions';

// Helpers
import { currency } from 'helpers';
import { useCart, useUser } from 'selectors';

// Types
import { User } from 'types';
import { Product } from 'types/parts';
import { CartListType, CartPurchasable, CartState } from 'types/parts/cart';
import { MaintenanceEventTableRow, PMPurchasable } from 'types/maintenance';

// Constants
import { sfEnabled } from 'constants/featureFlags';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';

// Api
import { useAddProductToCartMutation, useGetProductsQuery } from 'api';

// Analytics
import { AnalyticsCategories, MaintenanceAnalyticEventActions } from 'constants/analytics';
import { generateAnalyticsEvent } from 'helpers/analytics';

interface MaintenanceEventPartsDetailProps {
  maintenanceEvent?: MaintenanceEventTableRow;
  cartViewType: string;
  onCartViewType: (cartViewType: CartListType.VIEW_TYPE_LESS | CartListType.VIEW_TYPE_MORE) => void;
  onSubmitClick: () => void;
}

const PMKitContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Footer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  width: 100%;
  height: 6.25rem;
  padding: 1.3125rem 1.625rem 2.5rem 2.375rem;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  box-shadow: 0 -0.125rem 0.3125rem rgba(0, 0, 0, 0.05);

  display: flex;
  justify-content: end;
`;

const AddToCartContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
    margin-left: 1rem;
  }
`;

const TotalContainer = styled.div`
  p {
    margin: 0;
  }
  width: 4.75rem;
  height: 2.5rem;
  margin-right: 2rem;
`;

const MaintenanceEventPartsDetail = ({
  maintenanceEvent,
  cartViewType,
  onCartViewType,
  onSubmitClick
}: MaintenanceEventPartsDetailProps): ReactElement => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation(['fpns']);
  const {
    data: products,
    error: partError,
    isFetching: productsAreLoading
  } = useGetProductsQuery(
    maintenanceEvent?.purchasables && maintenanceEvent?.purchasables.length > 0
      ? {
          productIds: maintenanceEvent?.purchasables.map(
            (purchasable) => purchasable.purchasableId
          ),
          includeAssets: false,
          machineUuid: maintenanceEvent.machineId
        }
      : skipToken
  );
  const [cartList, setCartList] = useState<CartPurchasable[]>([]);
  const [addProductToCart] = useAddProductToCartMutation();
  const user = useUser() as User;
  const cart = useCart() as CartState;
  if (partError) {
    toast.warn(t('parts_cannot_be_retrieved'), { toastId: 'parts-invalid' });
  }
  useEffect(() => {
    if (
      !productsAreLoading &&
      products !== undefined &&
      maintenanceEvent !== undefined &&
      maintenanceEvent.purchasables !== undefined
    ) {
      setCartList(
        getCartPurchasableItems(
          products.items,
          maintenanceEvent.purchasables,
          maintenanceEvent.machineId || 'no-machine-id'
        )
      );
    }
  }, [products, productsAreLoading]);
  const addToCart =
    cartViewType === CartListType.VIEW_TYPE_LESS ? false : !cartList.some((item) => item.selected);
  const selectedItems = cartList.filter((cartItem) => cartItem.selected);
  const pmPartsTotalPrice = cartList
    ? sum(
        selectedItems.map(
          (p) => ((p.item?.custPrice ? p.item.custPrice : p.item.price) || 0) * p.quantity
        )
      )
    : 0;
  const cartChangeHandler = (cartList: CartPurchasable[]) => {
    setCartList(cartList);
  };

  return (
    <PMKitContainer>
      <Indicator style={{ marginLeft: 0 }} color={theme.colors.negativeRed}>
        {t('require_immediate_action')}
      </Indicator>
      <Typography as="h3" mb={2} size="1.125rem" weight="bold">
        {t('order_pm_kit')}
      </Typography>
      <Typography size="0.8125rem">{maintenanceEvent?.description}</Typography>
      {productsAreLoading ? (
        <Loader />
      ) : (
        cartList &&
        cartList.length > 0 && (
          <CartListComponent
            pmParts={cartList}
            viewType={CartListType.VIEW_TYPE_LESS}
            selectionType={CartListType.SELECTION_REMOVE}
            onCartViewType={onCartViewType}
            onQtyChange={cartChangeHandler}
            onSelectChange={cartChangeHandler}
          />
        )
      )}
      {!productsAreLoading && (
        <Footer>
          <TotalContainer>
            <Typography size="0.8125rem">{t('total', { ns: 'common' })}</Typography>
            <Typography size="1.125rem">
              {String(
                currency(
                  pmPartsTotalPrice,
                  cartList && cartList.length > 0 ? cartList[0].item.priceUnit : undefined
                )
              )}
            </Typography>
          </TotalContainer>
          <AddToCartContainer>
            <Button
              variant="primary"
              disabled={addToCart}
              onClick={() => {
                /* TODO: make cart actions accept multiple items rather than using a loop here */
                for (const i of selectedItems) {
                  try {
                    if (sfEnabled()) {
                      addProductToCart({
                        accountId: user.plants[0],
                        cart: cart,
                        product: i.item,
                        productId: i.item.sfProductId as string,
                        quantity: i.quantity,
                        machineId: i.groupId as string,
                        machineDescription:
                          i.groupId === undefined || i.groupId === UNIVERSAL_PRODUCTS_KEY
                            ? UNIVERSAL_PRODUCTS_KEY
                            : i.groupDescription
                      });
                    } else {
                      dispatch({
                        type: cartActions.ADD_TO_CART,
                        item: i.item,
                        quantity: i.quantity,
                        groupId: i.groupId as string,
                        groupDescription:
                          i.groupId === undefined || i.groupId === UNIVERSAL_PRODUCTS_KEY
                            ? UNIVERSAL_PRODUCTS_KEY
                            : i.groupDescription
                      });
                    }
                    generateAnalyticsEvent({
                      category: AnalyticsCategories.MAINTENANCE,
                      action:
                        MaintenanceAnalyticEventActions.MAINTENANCE_EVENT_PARTS_KIT_ADDED_TO_CART,
                      label: maintenanceEvent?.id
                    });
                  } catch (error) {
                    console.warn('Add to cart failed! Error:', error);
                    toast(t('error_add_to_cart', { item: i.item.sku }));
                  }
                }
                onSubmitClick();
              }}
            >
              {t('add_to_cart')}
            </Button>
          </AddToCartContainer>
        </Footer>
      )}
    </PMKitContainer>
  );
};

const getCartPurchasableItems = (
  products: Product[],
  purchasables: PMPurchasable[],
  machineId: string
): CartPurchasable[] => {
  const retList: CartPurchasable[] = [];
  for (const purchasable of purchasables) {
    const product = products.find((p) => purchasable.purchasableId == p.id);
    if (product !== undefined) {
      retList.push({
        item: product,
        quantity: purchasable.quantity,
        verified: false,
        selected: true,
        verificationComments: [],
        groupId: machineId
      });
    } else {
      console.warn(
        `Maintenance Event ${purchasable.maintenanceEventId} referenced purchasable ${purchasable.purchasableId} but no product information could be found!`
      );
    }
  }
  return retList;
};

export default MaintenanceEventPartsDetail;
