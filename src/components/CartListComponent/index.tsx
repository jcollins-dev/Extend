// 3rd party
import React, { ReactElement, useState } from 'react';
import useCart from 'selectors/cartSelectors';
import styled, { useTheme } from 'styled-components';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { Button, InformationTooltip, Typography } from 'components';
import CartListRowComponent from './CartListRow';

// Helpers
import { currency, isCartVerificationExpired, isCartVerified } from 'helpers';

// Types
import { Machine } from 'types';
import {
  CartState,
  CartListSelectionType,
  CartListViewType,
  CartPurchasable,
  CartListType
} from 'types/parts/cart';

import { useGetProductsQuery, useGetMachinesQuery } from 'api';
import { toast } from 'react-toastify';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useDispatch } from 'react-redux';
import { cartActions } from 'actions';
import { JBTRoutes } from 'constants/routes';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';
import { ShoppingCartIcon } from 'icons';
import Loader from 'components/Loader';

type CartListArguments = {
  handleClose?: () => void;
  viewType: CartListViewType;
  selectionType: CartListSelectionType;
  pmParts?: CartPurchasable[];
  selectAllControl?: JSX.Element;
  selectionHandler?: (id: string) => void;
  onCartViewType?: (
    cartViewType: CartListType.VIEW_TYPE_LESS | CartListType.VIEW_TYPE_MORE
  ) => void;
  onQtyChange?: (CartPurchasableList: CartPurchasable[]) => void;
  onSelectChange?: (CartPurchasableList: CartPurchasable[]) => void;
};

const FullListContainer = styled.div`
  table:first-of-type {
    margin-top: 2.375rem;
  }
  table > h2 {
    margin-bottom: 0.5rem;
  }

  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 10rem;
`;

const CartListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0rem 2.375rem 0rem 2.375rem;
  ${({ defaultValue }) =>
    defaultValue !== CartListType.VIEW_TYPE_DEFAULT &&
    `
    margin: 0;
  `}
`;

const CartListRowsContainer = styled.div`
  & > div:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
`;

export const RemoveFromCartIcon = styled.div`
  display: block;
  text-align: center;
  align-items: center;
  min-width: 10%;
  max-width: 10rem;
  cursor: pointer;
`;

export const CartItemRowHeader = styled.div`
  display: flex;
  align-items: center;
  height: 3.25rem;
  p {
    margin-bottom: 0;
    padding: 10px;
  }
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-collapse: separate;
  border-spacing: 0;
  border: ${({ theme }) => theme.colors.borders.border02};
`;

export const CartItemRow = styled.div`
  display: flex;
  position: relative; // pop ups will be positioned relative to the row they're a child of
  align-items: center;
  height: 4.75rem;
  justify-content: start;
  p {
    margin-bottom: 0;
    padding: 0px 10px 0px;
  }
  :nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.white};
  }
  :nth-child(even) {
    background-color: ${({ theme }) => theme.colors.lightGrey1};
  }
  border-left: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  border-right: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  position: relative;
`;

export const CartUrgentText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 10%;
  max-width: 10%;
  text-align: left;
  justify-content: start;
  p {
    margin-bottom: 0;
  }
  svg {
    margin-left: 0.125rem;
    vertical-align: middle;
  }
`;

export const CartItemText = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  p {
    margin-bottom: 0;
  }
  ${({ defaultValue }) =>
    defaultValue === CartListType.VIEW_TYPE_LESS &&
    `
    width: 40%;
    min-width: 20%;
  `}
`;

export const PriceText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 15%;
  max-width: 15%;
  p {
    margin-bottom: 0;
  }
  ${({ defaultValue }) =>
    defaultValue === CartListType.VIEW_TYPE_LESS &&
    `
    min-width: 25%;
    max-width: 30%;
  `}
`;

export const CartItemSku = styled.div`
  display: flex;
  flex-direction: column;
  width: 10%;
  word-wrap: break-word;
  p {
    margin-bottom: 0;
    padding: 10px;
  }
`;

export const CartItemStock = styled.div`
  display: flex;
  flex-direction: column;
  width: 10%;
  p {
    margin-bottom: 0;
  }
`;

export const QuantityContainer = styled.div`
  width: 10%;
  padding: 0.875rem 1rem 0.875rem 0px;
  ${({ defaultValue }) =>
    defaultValue === CartListType.VIEW_TYPE_LESS &&
    `
    min-width: 25%;
    max-width: 25%;
  `}
`;

export const CommentsText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 20%;
  max-width: 20%;
  p {
    margin-bottom: 0;
  }
  ${({ defaultValue }) =>
    defaultValue === CartListType.VIEW_TYPE_LESS &&
    `
    width: 0%;
    display: none;
  `}
`;

export const SelectControl = styled.div`
  display: flex;
  flex-direction: column;
  width: 10%;
  text-align: left;
  align-self: center;
  justify-content: flex-start;
  div {
    align-self: flex-start;
  }
`;

const SelectAllControl = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.buttons.primary.fill};
  font-size: ${({ theme }) => theme.typography.text.bodyMediumBold.size};
  font-weight: ${({ theme }) => theme.typography.components.tableHeader.weight};
  line-height: ${({ theme }) => theme.typography.components.tableHeader.lineHeight};
  font-family: ${({ theme }) => theme.typography.family};
  text-align: left;
  align-self: flex-start;
`;

const TotalRow = styled.div`
  height: 6.25rem;
  padding-top: 0rem;
  width: 100%;
  display: flex;
  p,
  h2 {
    margin: 0;
  }
`;

const TotalText = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  // apologies for the magic number,
  // but this gets the total text where it needs to go
  margin-left: 55.1%;
  font h3,
  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ViewTypeText = styled.div`
  display: flex;
  align-self: end;
  cursor: pointer;
  h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.mediumBlue};
  }
`;

const Box = styled.div`
  alight-items: center;
  justify-content: center;
  display: flex;
  margin-top: 12rem;
`;

const EmptyCartBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const EmptyCartIcon = styled.div`
  display: flex;
`;

const EmptyCartText = styled.div`
  display: flex;
`;

const EmptyCartButton = styled.div`
  display: flex;
  padding-bottom: 1.25rem;
`;

const HeaderRowComponent = ({
  viewType,
  selectionType,
  selectAllControl
}: CartListArguments): JSX.Element => {
  const { t } = useTranslation(['fpns']);
  return (
    <CartItemRowHeader style={{ marginBottom: 0 }}>
      {viewType === CartListType.VIEW_TYPE_DEFAULT && <RemoveFromCartIcon></RemoveFromCartIcon>}
      {viewType === CartListType.VIEW_TYPE_MORE &&
        selectionType === CartListType.SELECTION_MULTI_SELECT && (
          <SelectControl>{selectAllControl}</SelectControl>
        )}
      {viewType === CartListType.VIEW_TYPE_DEFAULT && (
        <CartUrgentText defaultValue={viewType}>
          <Typography variant="body1">
            {t('parts_table_urgent')}
            <InformationTooltip placement="top" tooltipText={t('parts_urgent_message')} />
          </Typography>
        </CartUrgentText>
      )}
      <CartItemText defaultValue={viewType}>
        <Typography variant="body1">{t('parts_table_part')}</Typography>
      </CartItemText>
      {(viewType === CartListType.VIEW_TYPE_DEFAULT ||
        viewType === CartListType.VIEW_TYPE_MORE) && (
        <CartItemSku>
          <Typography variant="body1">{t('parts_table_sku')}</Typography>
        </CartItemSku>
      )}
      {viewType === CartListType.VIEW_TYPE_MORE && (
        <CartItemStock>
          <Typography variant="body1">{t('parts_table_stock')}</Typography>
        </CartItemStock>
      )}
      <QuantityContainer defaultValue={viewType}>
        <Typography variant="body1">{t('parts_table_quantity')}</Typography>
      </QuantityContainer>
      <PriceText defaultValue={viewType} style={{ padding: 0 }}>
        <Typography variant="body1">{t('parts_table_price')}</Typography>
      </PriceText>
      {viewType === CartListType.VIEW_TYPE_MORE && (
        <CommentsText defaultValue={viewType}>
          <Typography variant="body1">{t('parts_table_comments')}</Typography>
        </CommentsText>
      )}
    </CartItemRowHeader>
  );
};

function organizeByGroup(cartItems: CartPurchasable[]) {
  const retMap = new Map<string, CartPurchasable[]>();
  retMap.set(UNIVERSAL_PRODUCTS_KEY, []);

  cartItems.forEach((cartItem) => {
    if (!cartItem.groupId) retMap.get(UNIVERSAL_PRODUCTS_KEY)?.push(cartItem);
    else {
      if (retMap.has(cartItem.groupId)) {
        retMap.get(cartItem.groupId)?.push(cartItem);
      } else {
        retMap.set(cartItem.groupId, [cartItem]);
      }
    }
  });

  return retMap;
}

function organizeCartByGroup(cartState: CartState | null): Map<string, CartPurchasable[]> {
  if (!cartState) {
    return new Map();
  }
  return organizeByGroup(cartState.items);
}

function organizePMPartsByMachine(pmParts: CartPurchasable[]): Map<string, CartPurchasable[]> {
  const pmMap = organizeByGroup(pmParts);
  pmMap.delete(UNIVERSAL_PRODUCTS_KEY);
  return pmMap;
}

function getMachineDisplayName(
  machineKey: string,
  machineInfo: Machine[] | undefined,
  machineInfoFetching: boolean,
  t: TFunction<'fpns'[], undefined>
) {
  if (machineKey === UNIVERSAL_PRODUCTS_KEY) return t('universal_products');
  else if (machineInfoFetching) return <i>{t('machine_name_loading')}</i>;
  return machineInfo !== undefined
    ? machineInfo?.filter((m) => m.id === machineKey)[0].description
    : t('machine_name_not_available');
}

const CartListComponent = ({
  viewType,
  handleClose,
  selectionType,
  pmParts,
  onCartViewType,
  onQtyChange,
  onSelectChange
}: CartListArguments): ReactElement => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation(['fpns']);
  const cart = useCart() as CartState;
  const [viewTypeState, setViewTypeState] = useState(viewType);
  const [localCartItems, updateLocalCartItems] = useState<CartPurchasable[]>([]);
  const [cartUpdateLoading, setCartUpdateLoading] = useState(false);

  const productUUIDs = cart?.items.map((item) => item.item.id);
  // Moving the hook call outside of the condition, as hooks should not be conditionally called
  // (surprised we did not get a "too few hooks" react error).
  // Will use skipToken to handle cases where we do not want this data.

  const { data: verificationProductsResults, error: productError } = useGetProductsQuery(
    viewType === CartListType.VIEW_TYPE_DEFAULT && productUUIDs && productUUIDs.length > 0
      ? { productIds: productUUIDs }
      : skipToken
  );

  if (viewType === CartListType.VIEW_TYPE_DEFAULT && verificationProductsResults) {
    const verificationProducts = verificationProductsResults.items;
    if (productError) {
      toast('Warning: Cart cannot be verified.', { toastId: 'cant-be-verified' });
    } else if (
      verificationProducts.length > 0 &&
      (isCartVerificationExpired(cart) || !isCartVerified(cart))
    ) {
      dispatch({ type: cartActions.VERIFY_CART, verificationItems: verificationProducts });
    }
  }
  const cartDataByGroup = pmParts ? organizePMPartsByMachine(pmParts) : organizeCartByGroup(cart);

  let groupIds: string[] = cart?.items
    ? cart.items.map((item) => item.groupId || UNIVERSAL_PRODUCTS_KEY)
    : [];
  // Remove the universal group id, if present
  groupIds = groupIds.filter((id) => id !== UNIVERSAL_PRODUCTS_KEY);
  // At the moment, only grouping by machine IDs, so use the machines by IDs query
  const { data: machineInfo, isFetching: machineInfoFetching } = useGetMachinesQuery(
    groupIds.length === 0
      ? skipToken
      : {
          uuids: groupIds,
          includeResources: false
        }
  );
  return (
    <FullListContainer>
      {Array.from(cartDataByGroup.entries()).map((entry) => {
        const [group, items] = entry;

        const currencyGroups: Record<string, number> = {};
        items.forEach((itemGroup) => {
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

        const subTotalCost = Object.keys(currencyGroups)
          .map((priceUnit) => {
            return currency(currencyGroups[priceUnit], priceUnit);
          })
          .join(', ');
        if (pmParts && localCartItems.length === 0) {
          updateLocalCartItems(
            pmParts.map((cartItem) => {
              return {
                ...cartItem,
                selected: true
              };
            })
          );
        }
        const viewTypeClickHandler = () => {
          const vtState =
            viewTypeState === CartListType.VIEW_TYPE_LESS
              ? CartListType.VIEW_TYPE_MORE
              : CartListType.VIEW_TYPE_LESS;
          setViewTypeState(vtState);
          onCartViewType && onCartViewType(vtState);
          onSelectChange && onSelectChange(localCartItems);
        };
        // Create the control component for (de)selecting all
        const selectAllControl = (
          <SelectAllControl
            role="button"
            onClick={() => {
              const updatedCartItems = localCartItems.some((cartItem) => !!cartItem.selected)
                ? localCartItems.map((cartItem) => {
                    return { ...cartItem, selected: false };
                  })
                : localCartItems.map((cartItem) => {
                    return { ...cartItem, selected: true };
                  });
              updateLocalCartItems(updatedCartItems);
              onSelectChange && onSelectChange(updatedCartItems);
            }}
          >
            {localCartItems.some((cartItem) => cartItem.selected) ? 'Deselect All' : 'Select All'}
          </SelectAllControl>
        );
        const checkHandler = (id: string) => {
          const updatedCartItems = localCartItems.map((cartItem) =>
            typeof cartItem.selected === 'undefined'
              ? { ...cartItem, selected: true }
              : cartItem.item.id.indexOf(id) !== -1
              ? { ...cartItem, selected: !cartItem.selected }
              : { ...cartItem }
          );
          updateLocalCartItems(updatedCartItems);
          onSelectChange && onSelectChange(updatedCartItems);
        };
        const urgentChangeHandler = (item: CartPurchasable) => {
          const updatedItem = { ...item };
          typeof updatedItem.urgent === 'undefined'
            ? (updatedItem.urgent = true)
            : (updatedItem.urgent = !updatedItem.urgent);
          dispatch({
            type: cartActions.UPDATE_CART_ITEM,
            item: updatedItem.item,
            urgent: updatedItem.urgent,
            groupId: updatedItem.groupId
          });
        };
        const removeHandler = (item: CartPurchasable) => {
          dispatch({
            type: cartActions.REMOVE_FROM_CART,
            item: item.item,
            quantity: item.quantity,
            groupId: item.groupId
          });
        };
        const qtyChangeHandler = (item: CartPurchasable, isCartUpdateLoading: boolean) => {
          setCartUpdateLoading(isCartUpdateLoading);
          const updatedCartItems = cloneDeep(localCartItems);
          const itemIndex = localCartItems.findIndex(
            (cartItem) => cartItem.item.id === item.item.id && cartItem.groupId === item.groupId
          );
          updatedCartItems[itemIndex] = { ...item };
          updateLocalCartItems(updatedCartItems);
          onQtyChange && onQtyChange(updatedCartItems);
        };

        const rowItems = viewType === CartListType.VIEW_TYPE_DEFAULT ? items : localCartItems;
        if (rowItems.length !== 0)
          return (
            <div key={group}>
              <CartListContainer defaultValue={viewType}>
                {viewType === CartListType.VIEW_TYPE_DEFAULT && (
                  <Typography variant="h2">
                    {getMachineDisplayName(group, machineInfo, machineInfoFetching, t)}
                  </Typography>
                )}
                {viewType !== CartListType.VIEW_TYPE_DEFAULT && (
                  <ViewTypeText onClick={viewTypeClickHandler}>
                    <Typography variant="h6">
                      {viewTypeState === CartListType.VIEW_TYPE_LESS
                        ? t('see_more')
                        : t('see_less')}
                    </Typography>
                  </ViewTypeText>
                )}
                <HeaderRowComponent
                  viewType={viewTypeState}
                  selectionType={selectionType}
                  selectAllControl={selectAllControl}
                />
                <CartListRowsContainer>
                  {cartUpdateLoading && <Loader />}
                  {!cartUpdateLoading &&
                    rowItems.map((purchasable, i) => {
                      return (
                        purchasable.item && (
                          <CartListRowComponent
                            viewType={viewTypeState}
                            key={`${purchasable.item.sku}-${i}`}
                            purchasable={purchasable}
                            selectionType={selectionType}
                            selectionHandler={checkHandler}
                            removeHandler={removeHandler}
                            qtyChangeHandler={qtyChangeHandler}
                            urgentChangeHandler={urgentChangeHandler}
                            handleClose={handleClose}
                          />
                        )
                      );
                    })}
                </CartListRowsContainer>
                {rowItems.length != 0 && viewType === CartListType.VIEW_TYPE_DEFAULT && (
                  <TotalRow>
                    <TotalText>
                      <Typography variant="h3">{t('machine_subtotal')}</Typography>
                      <Typography variant="h2">
                        {subTotalCost !== '' ? String(subTotalCost) : 'N/A'}
                      </Typography>
                    </TotalText>
                  </TotalRow>
                )}
              </CartListContainer>
            </div>
          );
      })}
      {cartDataByGroup.size === 1 && cartDataByGroup.get(UNIVERSAL_PRODUCTS_KEY)?.length === 0 && (
        <Box>
          <EmptyCartBox>
            <EmptyCartIcon>
              {(ShoppingCartIcon as (color?: string) => JSX.Element)(theme.colors.darkGrey)}
            </EmptyCartIcon>
            <EmptyCartText>
              <Typography variant="h3">{t('cart_empty')}</Typography>
            </EmptyCartText>
            <EmptyCartButton>
              <Button
                variant="warning"
                bgColor={theme.colors.mediumBlue}
                onClick={() => window.location.assign(JBTRoutes.partsCatalog)}
              >
                {t('browse_parts_store')}
              </Button>
            </EmptyCartButton>
          </EmptyCartBox>
        </Box>
      )}
    </FullListContainer>
  );
};

export default CartListComponent;
