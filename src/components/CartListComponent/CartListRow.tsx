// 3rd party libraries
import React, { ReactElement, useEffect, useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// State management
import { cartActions } from 'actions';

// Constants
import { sfEnabled } from 'constants/featureFlags';

// Components
import { Checkbox, CustomerPrice, Input, Typography } from 'components';
import {
  CartItemRow,
  RemoveFromCartIcon,
  CartItemText,
  CartItemSku,
  QuantityContainer,
  PriceText,
  SelectControl,
  CartItemStock
} from '.';
import CartRowCommentComponent from './CartRowCommentContainer';

// Types
import { User } from 'types';
import {
  CartListViewType,
  CartPurchasable,
  CartListType,
  CartState,
  CartListSelectionType
} from 'types/parts/cart';

// Providers
import { useLanguage } from 'providers';

// Helpers
import { currency, getProductDescription, getStockText } from 'helpers';

import { useCart, useUser } from 'selectors';

// Api
import { useUpdateCartProductMutation } from 'api';

type CartRowListArguments = {
  handleClose?: () => void;
  viewType: CartListViewType;
  selectionType: CartListSelectionType;
  purchasable: CartPurchasable;
  selectionHandler?: (id: string) => void;
  removeHandler?: (purchasable: CartPurchasable) => void;
  qtyChangeHandler?: (purchasable: CartPurchasable, cartUpdateResult: boolean) => void;
  urgentChangeHandler?: (purchasable: CartPurchasable) => void;
};

const CartListRowComponent = ({
  viewType,
  handleClose,
  purchasable,
  selectionType,
  selectionHandler,
  removeHandler,
  qtyChangeHandler,
  urgentChangeHandler
}: CartRowListArguments): ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['fpns']);
  const [cartItem, setCartItem] = useState<CartPurchasable>(purchasable);
  useEffect(() => {
    setCartItem(purchasable);
  }, [purchasable]);
  const user = useUser() as User;
  const cart = useCart() as CartState;
  const { languageId } = useLanguage();
  const [updateCartProduct, updateCartResult] = useUpdateCartProductMutation();
  const changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const rawQuantity = evt.target.value.length < 1 ? String(0) : evt.target.value;
    const newQuantity =
      Math.max(parseInt(rawQuantity), 0) == 0
        ? cartItem.quantity
        : Math.max(parseInt(rawQuantity), 0);
    const copyCartItem = { ...cartItem, ['quantity']: newQuantity };
    setCartItem(copyCartItem);
    qtyChangeHandler && qtyChangeHandler(copyCartItem, updateCartResult.isLoading);
    if (viewType === CartListType.VIEW_TYPE_DEFAULT) {
      const sfCartItem = cart.sfCart.cartItems?.find(
        (sfItem) => sfItem.cartItem.productId === copyCartItem.item.sfProductId
      );
      try {
        if (sfEnabled()) {
          updateCartProduct({
            accountId: user.organizations[0],
            cart: cart,
            product: copyCartItem.item,
            productId: copyCartItem.item.sfProductId as string,
            quantity: newQuantity,
            machineId: copyCartItem.groupId as string,
            cartItemId: sfCartItem?.cartItem.cartItemId
          });
        } else {
          dispatch({
            type: cartActions.SET_ITEM_QUANTITY,
            item: copyCartItem.item,
            groupId: copyCartItem.groupId as string,
            quantity: newQuantity
          });
        }
      } catch (error) {
        console.warn('Update to cart failed! Error:', error);
        toast(`⚠️ There was a problem updating the quantity`);
      }
    }
  };
  return (
    <CartItemRow key={cartItem.item.id}>
      {viewType === CartListType.VIEW_TYPE_DEFAULT ? (
        <>
          <RemoveFromCartIcon onClick={() => removeHandler && removeHandler(cartItem)}>
            <FontAwesomeIcon icon={faTimes} />
          </RemoveFromCartIcon>
          <SelectControl>
            <Checkbox
              key={`checkbox-${cartItem.item.sku}`}
              checked={cartItem.urgent as boolean}
              onChange={() => {
                urgentChangeHandler && urgentChangeHandler(cartItem);
              }}
            />
          </SelectControl>
        </>
      ) : viewType === CartListType.VIEW_TYPE_MORE &&
        selectionType === CartListType.SELECTION_MULTI_SELECT ? (
        <SelectControl>
          <Checkbox
            key={`checkbox-${cartItem.item.sku}`}
            checked={cartItem.selected as boolean}
            onChange={() => {
              selectionHandler && selectionHandler(cartItem.item.id);
            }}
          />
        </SelectControl>
      ) : (
        viewType === CartListType.VIEW_TYPE_MORE &&
        selectionType === CartListType.SELECTION_REMOVE && <></>
      )}
      <CartItemText defaultValue={viewType}>
        {/* where do we get this text from? */}
        <>
          {viewType === CartListType.VIEW_TYPE_DEFAULT && (
            <Typography variant="body1">
              <i>{t('manufacturer_not_available')}</i>
            </Typography>
          )}
          <Typography variant="body2">
            {getProductDescription(cartItem.item, languageId)}
          </Typography>
        </>
      </CartItemText>
      {(viewType === CartListType.VIEW_TYPE_DEFAULT ||
        viewType === CartListType.VIEW_TYPE_MORE) && (
        <CartItemSku>
          <Typography variant="body1">{cartItem.item.stockCode || cartItem.item.sku}</Typography>
        </CartItemSku>
      )}
      {viewType === CartListType.VIEW_TYPE_MORE && (
        <CartItemStock>
          <Typography variant="body1">{t(getStockText(purchasable.item))}</Typography>
        </CartItemStock>
      )}
      <QuantityContainer defaultValue={viewType}>
        <Input
          type="number"
          id="qty"
          min={1}
          variant="white"
          value={cartItem.quantity}
          onChange={changeHandler}
        />
      </QuantityContainer>
      <PriceText defaultValue={viewType}>
        <Typography variant="subtitle">
          <CustomerPrice
            product={cartItem.item}
            fontSizeInREM={1}
            inline={true}
            handleClose={handleClose}
          />
        </Typography>
        <Typography variant="body2">
          {typeof cartItem.item.price !== 'undefined' &&
            cartItem.item.price > 0 &&
            cartItem.item.isPurchasable &&
            String(
              currency(
                cartItem.item.custPrice
                  ? cartItem.item.custPrice * cartItem.quantity
                  : cartItem.item.price * cartItem.quantity,
                cartItem.item.priceUnit
              )
            ) +
              ' ' +
              t('total')}
          {typeof cartItem.item.price !== 'undefined' &&
            cartItem.item.price <= 0 &&
            t('contact_jbt_for_price')}
        </Typography>
      </PriceText>
      {viewType === CartListType.VIEW_TYPE_MORE && (
        <CartRowCommentComponent
          viewType={viewType}
          purchasable={cartItem.item}
          verificationComments={cartItem.verificationComments}
        />
      )}
    </CartItemRow>
  );
};

export default CartListRowComponent;
