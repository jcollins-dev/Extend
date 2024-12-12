import { TFunction } from 'i18next';
import { Action, BaseType, WithQuantity } from 'types';
import { OrderAddress, OrderBillee, Product } from 'types/parts';

export interface CartInput extends BaseType {
  accountId: string;
  product: Product;
  cart: CartState;
  quantity: number;
  cartItemId?: string;
  machineId?: string;
  machineDescription?: string;
}

export type CartState = {
  userId?: string;
  ids: Array<string>;
  sfCartId?: string;
  items: Array<CartPurchasable>;
  sfCart: SFCart;
  lastUpdatedTimestamp: number;
  lastVerifiedTimestamp?: number;
};

export enum CartVerificationComment {
  PRICE_CHANGE = 'priceChange',
  STOCK_CHANGE = 'stockChange',
  LEAD_TIME_CHANGE = 'leadTimeChange',
  LOW_STOCK = 'lowStock'
}

export enum CartListType {
  VIEW_TYPE_DEFAULT = 'default',
  VIEW_TYPE_LESS = 'less',
  VIEW_TYPE_MORE = 'more',
  SELECTION_REMOVE = 'remove',
  SELECTION_MULTI_SELECT = 'multi-select'
}

export type CartListViewType = 'less' | 'more' | 'default';

export type CartListSelectionType = 'multi-select' | 'remove';

export interface CartPurchasable extends WithQuantity {
  item: Product;
  verified: boolean;
  // Used for display purposes only
  groupId?: string;
  groupDescription?: string;
  selected?: boolean;
  urgent?: boolean;
  currency?: string;
  verificationComments: CartVerificationComment[];
}

export interface CartResponse extends BaseType {
  cartId?: string;
  cartItemId?: string;
  productId?: string;
  accountId?: string;
  quantity?: number;
  status?: number;
  type?: string;
  data?: { detail: Record<string, unknown> };
}

export interface SFCartItemDetails {
  cartId: string;
  cartItemId: string;
  productId: string;
  quantity: number;
  type: string;
  name?: string;
  listPrice?: string;
  salesPrice?: string;
  totalAmount?: string;
}

export interface SFCartItem extends BaseType {
  cartItem: SFCartItemDetails;
}

export interface SFCartSummary extends BaseType {
  accountId: string;
  cartId: string;
  grandTotalAmount: string;
  name: string;
  ownerId: string;
  status: string;
  type: string;
  totalProductCount: string;
}

export interface SFCart extends BaseType {
  cartItems?: SFCartItem[];
  cartSummary?: SFCartSummary;
}

export interface CartAction extends Action {
  type: string;
  item?: Product;
  quantity?: number;
  urgent?: boolean;
  verificationItems?: Product[];
  userId?: string;
  groupId?: string;
  groupDescription?: string;
  sfCart?: SFCart;
  sfCartId?: string;
  t?: TFunction;
  languageId?: string;
}

export type CartOrderDetails = {
  billingAddress: OrderAddress;
  shipMatchBilling?: boolean;
  allowPartialShipments?: boolean;
  shippingAddress?: OrderAddress;
  billee: OrderBillee;
  creator: string;
  approver: string;
  customerPoNumber: string;
};
