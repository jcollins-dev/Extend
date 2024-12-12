import { every } from 'lodash';

import { CartState } from 'types/parts/cart';

import { JBTRoutes } from 'constants/routes';

export const CART_VERIFICATION_TIME_MILLIS = 12 * 3600000; // first number is hours
// TODO: move to backend
const CART_EXPIRATION_TIME_MILLIS = 2 * 86400000; // first number is days

export function isCartVerified(cartState: CartState | null): boolean {
  const verifiableItems: boolean[] = [];
  //none purchasable items are not verified and would always verified = false
  cartState?.items.forEach((item) => {
    if (item.item.isPurchasable) {
      verifiableItems.push(item.verified);
    }
  });
  return cartState != null && every(verifiableItems) && !isCartVerificationExpired(cartState);
}

export function isCartVerificationExpired(cartState: CartState | null): boolean {
  if (cartState === null) {
    return true;
  }
  return (
    cartState.lastVerifiedTimestamp === undefined ||
    Date.now() - cartState.lastVerifiedTimestamp > CART_VERIFICATION_TIME_MILLIS
  );
}

export function isCartExpired(cartState: CartState | null): boolean {
  if (cartState === null) {
    return true;
  }
  return Date.now() - cartState.lastUpdatedTimestamp > CART_EXPIRATION_TIME_MILLIS;
}

export const shouldShowCartAndProductIcons = (pathname: string): boolean => {
  return (
    pathname.includes(JBTRoutes.fleet) ||
    pathname.includes(JBTRoutes.dashboard) ||
    pathname.includes(JBTRoutes.parts) ||
    (pathname.includes(JBTRoutes.maintenance) && !pathname.includes('/maintenance-schedule')) ||
    pathname.includes(JBTRoutes.notifications)
  );
};

export const shouldNotShowLanguageDropdown = (pathname: string): boolean => {
  return (
    pathname.includes(JBTRoutes.login) ||
    pathname.includes(JBTRoutes.userManagement) ||
    pathname.includes('/onboarding') ||
    pathname.includes(JBTRoutes.admin) ||
    pathname.includes(JBTRoutes.machineManagement)
  );
};
