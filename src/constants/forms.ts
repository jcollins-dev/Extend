// Types
import { OrderAddress, OrderBillee } from 'types/parts';
import { CartOrderDetails } from 'types/parts/cart';

export const defaultAddress: OrderAddress = {
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: ''
};

export const defaultBillee: OrderBillee = {
  firstName: '',
  lastName: ''
};

export const defaultOrderDetails: CartOrderDetails = {
  billingAddress: { ...defaultAddress },
  shipMatchBilling: false,
  shippingAddress: { ...defaultAddress },
  billee: { ...defaultBillee },
  creator: '',
  approver: '',
  customerPoNumber: ''
};
