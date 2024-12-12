// 3rd party libs
import i18next from 'i18next';
import { TFunction } from 'i18next';

// Types
import { Product } from 'types/parts';
import { CartAction, CartState, CartPurchasable, CartVerificationComment } from 'types/parts/cart';

// Functions
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

// Actions
import { cartActions } from 'actions';
import { cloneDeep, sum } from 'lodash';
import { isCartExpired } from 'helpers';
import { LOCAL_STORAGE_CART_KEY_PREFIX, STOCK_WARNING_PERCENTAGE } from 'constants/cart';

// Analytics
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';
import { generateAnalyticsEvent } from 'helpers/analytics';

// Constants
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';
import { SFCart, SFCartItem, SFCartSummary } from 'types/parts/cart';

// Helpers
import { addQuotes } from 'helpers/strings';
import { sfEnabled } from 'constants/featureFlags';

export const defaultSFCartState = {
  cartItems: new Array<SFCartItem>(),
  cartSummary: {} as SFCartSummary
} as SFCart;

export const defaultCartState = {
  ids: new Array<string>(),
  items: new Array<CartPurchasable>(),
  lastUpdatedTimestamp: Date.now(),
  sfCart: defaultSFCartState,
  userId: JSON.parse(sessionStorage.getItem('user') as string)?.id
} as CartState;

function formatItemToastText(item: Product): string {
  return `${((item.description ?? item.sku) as string).slice(0, 64)}`;
}

function unverifyCart(cartState: CartState): CartState {
  for (const item of cartState.items) {
    item.verified = false;
    item.verificationComments = [];
  }
  cartState.lastVerifiedTimestamp = undefined;
  return cartState;
}

function getCartFromLocalStorage(userId: string): CartState {
  const cartKey = `${LOCAL_STORAGE_CART_KEY_PREFIX}-${userId}`;
  const cartString = localStorage.getItem(cartKey);
  if (cartString != null) {
    const savedCart: CartState | undefined = JSON.parse(localStorage.getItem(cartKey) ?? '');
    if (savedCart && isCartExpired(savedCart)) {
      toast(i18next.t('saved_cart_expired', { ns: 'fpns' }));
      localStorage.removeItem(cartKey);
    } else if (savedCart) {
      return {
        userId: userId,
        ...unverifyCart(savedCart)
      };
    }
  }
  return {
    ...defaultCartState
  };
}

function persistCartInLocalStorage(cartState: CartState): void {
  cartState.lastUpdatedTimestamp = Date.now();
  if (cartState.userId) {
    const cartKey = `${LOCAL_STORAGE_CART_KEY_PREFIX}-${cartState.userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cartState));
  } else {
    console.error("User id not set -- can't save cart!");
  }
}

const setSFCart = (cartState: CartState, sfCart: SFCart): CartState => {
  cartState.sfCart = sfCart;
  return cartState;
};

function addToCart(
  cartState: CartState,
  item: Product,
  quantity = 1,
  groupId?: string,
  groupDescription?: string
): CartState {
  if (quantity <= 0) {
    console.error('Cannot add zero or less of a product to the cart.');
    return cartState;
  }
  // can't serialize a Set in redux, so we have to convert back and forth to store it
  const idSet = new Set<string>(cartState.ids);
  const currentGroupId = groupId || UNIVERSAL_PRODUCTS_KEY;
  const existingItemIndex = cartState.items.findIndex(
    (cartItem) =>
      cartItem.item.id === item.id &&
      cartItem.groupId === currentGroupId &&
      cartItem.item.priceUnit === item.priceUnit &&
      cartItem.item.custPrice === item.custPrice
  );
  // if the item is already in the set of items in the cart
  if (existingItemIndex !== -1) {
    // Add the new quantity to the existing item
    cartState.items[existingItemIndex].quantity += quantity;

    toast(
      i18next.t('added_to_cart', {
        item: `${quantity} ${formatItemToastText(item)}${quantity !== 1 ? 's' : ''} ${
          quantity === 1 ? i18next.t('was', { ns: 'fpns' }) : i18next.t('were', { ns: 'fpns' })
        }`,
        ns: 'fpns'
      })
    );
    generateAnalyticsEvent({
      category: AnalyticsCategories.ECOMMERCE,
      action: ECommerceAnalyticEventActions.ADD_TO_CART,
      label: item.sku,
      value: quantity
    });
    // if the item isn't already in our cart, add it as a new cart purchasable
  } else if (item.id) {
    idSet.add(item.id);
    cartState.items.push({
      item: item,
      quantity: quantity,
      verified: false,
      verificationComments: [],
      groupId: currentGroupId,
      groupDescription: groupDescription
    });

    toast(
      i18next.t('added_to_cart', {
        item: `${quantity} ${formatItemToastText(item)}${quantity !== 1 ? 's' : ''} ${
          quantity === 1 ? i18next.t('was', { ns: 'fpns' }) : i18next.t('were', { ns: 'fpns' })
        }`,
        ns: 'fpns'
      })
    );
    generateAnalyticsEvent({
      category: AnalyticsCategories.ECOMMERCE,
      action: ECommerceAnalyticEventActions.ADD_TO_CART,
      label: item.sku,
      value: quantity
    });
    if (quantity > STOCK_WARNING_PERCENTAGE * item.stock) {
      const currentGroupId = groupId || UNIVERSAL_PRODUCTS_KEY;
      applyOrRemoveLowStockWarning(
        cartState,
        cartState.items.findIndex(
          (i) => i.item.id === item.id && i.item.groupId === currentGroupId
        ),
        item.stock,
        quantity
      );
    }
  } else {
    toast.error(
      i18next.t('cannot_add_to_cart', {
        item: `${formatItemToastText(item) || i18next.t('item')}`,
        ns: 'fpns'
      })
    );
  }
  cartState.ids = Array.from(idSet.values());
  persistCartInLocalStorage(cartState);
  return cartState;
}

function removeFromCart(
  cartState: CartState,
  item: Product,
  quantity: number,
  groupId?: string
): CartState {
  if (quantity <= 0) {
    console.error('Cannot remove zero or less of a product from the cart.');
    return cartState;
  }

  // can't serialize a Set in redux, so we have to convert back and forth to store it
  const idSet = new Set<string>(cartState.ids);

  const currentGroupId = groupId || UNIVERSAL_PRODUCTS_KEY;
  const existingItemIndex = cartState.items.findIndex(
    (cartItem) => cartItem.item.id === item.id && cartItem.groupId === currentGroupId
  );
  if (existingItemIndex !== -1) {
    // if removing the quantity requested would take the
    // remaining quantity to 0 or below, just remove it entirely
    if (cartState.items[existingItemIndex].quantity - quantity <= 0) {
      cartState.items.splice(existingItemIndex, 1);

      // Also, remove its ID from idSet if no other item has its ID
      if (cartState.items.findIndex((cartItem) => cartItem.item.id === item.id) === -1) {
        idSet.delete(item.id);
      }
    } else {
      cartState.items[existingItemIndex].quantity -= quantity;
    }
    generateAnalyticsEvent({
      category: AnalyticsCategories.ECOMMERCE,
      action: ECommerceAnalyticEventActions.REMOVE_FROM_CART,
      label: item.description
    });
  } else {
    console.error(
      'And you may find yourself removing an item from your cart which you never added... \n And you may ask yourself... how did I get here?'
    );
  }
  cartState.ids = Array.from(idSet.values());
  if (cartState?.sfCart?.cartItems && sfEnabled()) {
    const sfCartItemIndex: number = cartState?.sfCart?.cartItems?.findIndex(
      (sfItem: SFCartItem) => sfItem.cartItem.productId === item.sfProductId
    ) as number;
    const sfCartItems: SFCartItem[] = cartState?.sfCart?.cartItems as SFCartItem[];
    if (sfCartItemIndex !== -1) {
      if (sfCartItems[sfCartItemIndex].cartItem.quantity - quantity <= 0) {
        sfCartItems.splice(sfCartItemIndex, 1);
      }
    } else {
      sfCartItems[sfCartItemIndex].cartItem.quantity -= quantity;
    }
  }
  persistCartInLocalStorage(cartState);
  toast(
    i18next.t('removed_from_cart', {
      item: `${quantity} ${formatItemToastText(item)}`,
      ns: 'fpns'
    })
  );
  return cartState;
}

function updateItemQuantity(
  cartState: CartState,
  item: Product,
  quantity: number,
  groupId?: string
): CartState {
  if (quantity < 0) {
    console.error('Cannot update quantity of a product to less than 0.');
    return cartState;
  }

  const currentGroupId = groupId || UNIVERSAL_PRODUCTS_KEY;
  const existingItemIndex = cartState.items.findIndex(
    (cartItem) =>
      cartItem.item.id === item.id &&
      cartItem.groupId === currentGroupId &&
      cartItem.item.price === item.price &&
      cartItem.item.custPrice === item.custPrice
  );
  if (existingItemIndex === -1) {
    console.error("Cannot update an item's quantity if it isn't in the cart at all.");
    return cartState;
  }

  cartState.items[existingItemIndex].quantity = quantity;
  applyOrRemoveLowStockWarning(cartState, existingItemIndex, item.stock, quantity); // this uses the passed item, which should always be more up to date than the cart saved version.
  persistCartInLocalStorage(cartState);
  return cartState;
}

function applyOrRemoveLowStockWarning(
  cartState: CartState,
  itemToUpdateIndex: number,
  stock: number,
  quantity: number
) {
  const itemHasLowStockWarning =
    cartState.items[itemToUpdateIndex]?.verificationComments.findIndex(
      (c) => c === CartVerificationComment.LOW_STOCK
    ) !== -1;
  if (quantity > STOCK_WARNING_PERCENTAGE * stock && !itemHasLowStockWarning) {
    cartState.items[itemToUpdateIndex].verificationComments.push(CartVerificationComment.LOW_STOCK);
    toast.warn(
      i18next.t('stock_exceeded_cart', {
        item: `${cartState.items[itemToUpdateIndex].item.description}`,
        ns: 'fpns'
      }),
      { toastId: 'stockWarning' }
    );
  } else if (quantity <= STOCK_WARNING_PERCENTAGE * stock) {
    cartState.items[itemToUpdateIndex].verificationComments = cartState.items[
      itemToUpdateIndex
    ].verificationComments.filter((c) => c != CartVerificationComment.LOW_STOCK);
  }
}

const updateCartItem = (
  cartState: CartState,
  item: Product,
  urgent: boolean,
  groupId?: string
): CartState => {
  const itemGroupId = groupId || UNIVERSAL_PRODUCTS_KEY;
  const itemToUpdateIndex = cartState.items.findIndex(
    (i) => i.item.id === item.id && i.groupId === itemGroupId
  );
  cartState.items[itemToUpdateIndex].urgent = urgent;
  persistCartInLocalStorage(cartState);
  return cartState;
};

function emptyCart(originalCartState: CartState): CartState {
  if (originalCartState.items.length !== 0) {
    const cartKey = `${LOCAL_STORAGE_CART_KEY_PREFIX}-${originalCartState.userId}`;
    if (localStorage.getItem(cartKey) === undefined) {
      console.error("Can't delete cart for invalid cart key!");
    } else {
      localStorage.removeItem(cartKey);
    }
    toast(i18next.t('all_cart_items_removed', { ns: 'fpns' }));
    generateAnalyticsEvent({
      category: AnalyticsCategories.ECOMMERCE,
      action: ECommerceAnalyticEventActions.EMPTY_CART,
      value: sum(originalCartState.items.map((item) => item.quantity))
    });
  }

  const { sfCart, ...defaultCartStateWithoutSF } = defaultCartState;
  const updatedSFCart: SFCart = cloneDeep(originalCartState.sfCart);
  updatedSFCart.cartItems = [];

  return {
    sfCart: updatedSFCart || sfCart,
    ...defaultCartStateWithoutSF
  };
}

function addVerificationCommentToCartPurchasable(
  originalPurchasable: CartPurchasable,
  verificationItem: Product
): void {
  if (
    originalPurchasable.item.price &&
    verificationItem.price &&
    originalPurchasable.item.price < verificationItem.price
  ) {
    originalPurchasable.verificationComments.push(CartVerificationComment.PRICE_CHANGE);
  }
  if (originalPurchasable.item.stock > verificationItem.stock) {
    originalPurchasable.verificationComments.push(CartVerificationComment.STOCK_CHANGE);
  }
  if (originalPurchasable.item.leadTime < verificationItem.leadTime) {
    originalPurchasable.verificationComments.push(CartVerificationComment.LEAD_TIME_CHANGE);
  }
  originalPurchasable.verified = true;
}

function verifyCart(cartState: CartState, verificationItems: Product[] | undefined): CartState {
  if (verificationItems === undefined) {
    return defaultCartState;
  } else if (verificationItems) {
    for (const existingItem of cartState.items) {
      const verificationItem = verificationItems.find((p) => p.id === existingItem.item.id);
      if (!existingItem.verified && verificationItem) {
        const itemToUpdateIndex = cartState.items.findIndex(
          (i) => i.item.id === verificationItem.id
        );
        addVerificationCommentToCartPurchasable(existingItem, verificationItem);
        applyOrRemoveLowStockWarning(
          cartState,
          itemToUpdateIndex,
          verificationItem.stock,
          cartState.items[itemToUpdateIndex].quantity
        );
      }
    }
    cartState.lastVerifiedTimestamp = Date.now();
  }
  return cartState;
}

function downloadCartCSV(cartState: CartState, t: TFunction, languageId: string) {
  // for CSV purposes, adds optional quotes around 'str' and doubles internal quotes as per spec
  function priceOrEmpty(price: number | undefined, unit: string | undefined): string {
    if (price === undefined || price === 0) {
      return 'N/A';
    }
    return unit + price.toFixed(2);
  }

  const csv: BlobPart[] = [];
  csv.push(
    `${t('part_number')}, ${t('description', { ns: 'common' })}, ${t('quantity', {
      ns: 'common'
    })}, ${t('list_price', { ns: 'fpns' })}, ${t('customer_price', { ns: 'fpns' })}\n`
  );
  for (const item of cartState.items) {
    const multilingualDescObj = item.item.multilingualDesc;
    type MultiligualLanguageKey = keyof typeof multilingualDescObj;
    const multilingualDesc = multilingualDescObj
      ? multilingualDescObj[languageId as MultiligualLanguageKey]
      : undefined;
    const finalDescription = multilingualDesc
      ? multilingualDesc
      : item.item.description
      ? item.item.description
      : item.item.manualDescription || 'N/A';
    csv.push(
      `${item.item.sku},${addQuotes(finalDescription)},${item.quantity},` +
        `${priceOrEmpty(item.item.price, item.item.priceUnit)},${priceOrEmpty(
          item.item.custPrice,
          item.item.priceUnit
        )}\n`
    );
  }
  saveAs(new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }), `cart-items.csv`);
}

export default (cartState = defaultCartState, action: CartAction): CartState => {
  switch (action.type) {
    case cartActions.ADD_TO_CART: {
      const { item, quantity, groupId, groupDescription, sfCart, sfCartId } = action;
      if (item) {
        const cartStateClone = { ...cartState, sfCartId: sfCartId };
        if (sfCart) {
          cartStateClone.sfCart = sfCart;
        }
        return addToCart(cloneDeep(cartStateClone), item, quantity, groupId, groupDescription);
      } else return cartState;
    }
    case cartActions.REMOVE_FROM_CART: {
      const { item, quantity, groupId } = action;
      if (item && quantity) {
        return removeFromCart(cloneDeep(cartState), item, quantity, groupId);
      } else return cartState;
    }
    case cartActions.SET_ITEM_QUANTITY: {
      const { item, quantity, groupId } = action;
      if (item && quantity) {
        return updateItemQuantity(cloneDeep(cartState), item, quantity, groupId);
      } else return cartState;
    }
    case cartActions.UPDATE_CART_ITEM: {
      const { item, urgent, groupId } = action;
      return updateCartItem(cloneDeep(cartState), item as Product, urgent as boolean, groupId);
    }
    case cartActions.EMPTY_CART: {
      return emptyCart(cartState);
    }
    case cartActions.VERIFY_CART: {
      const { verificationItems } = action;
      return verifyCart(unverifyCart(cloneDeep(cartState)), verificationItems);
    }
    case cartActions.SET_CART_USER_ID: {
      const { userId } = action;
      return userId ? getCartFromLocalStorage(userId) : defaultCartState;
    }
    case cartActions.DELETE_CART_USER_ID: {
      return defaultCartState;
    }
    case cartActions.DOWNLOAD_CART_CSV: {
      const { t, languageId } = action;
      downloadCartCSV(cartState, t as TFunction, languageId as string);
      return cartState;
    }
    case cartActions.SET_SF_CART: {
      const { sfCart } = action;
      return setSFCart(cloneDeep(cartState), sfCart as SFCart);
    }
    default: {
      return cartState;
    }
  }
};
