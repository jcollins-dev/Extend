import { JBTRoutes } from 'constants/routes';
import { defaultCartState } from 'reducers/cart';
import { CartState } from 'types';
import {
  isCartVerificationExpired,
  isCartVerified,
  shouldNotShowLanguageDropdown,
  shouldShowCartAndProductIcons
} from './cart';

const testPartData = {
  id: '60a0a802-e4f5-472d-8f1b-bd3736299311',
  sku: 'AT02710',
  assets: [],
  description: 'MHS CORE ASSY,AV-X/AV-M',
  stock: 1,
  leadTime: 143,
  price: 0,
  priceUnit: '',
  businessUnit: 'avure',
  productId: '89739',
  machineId: '43500801-4a6d-4c54-b25e-6040710e2d69',
  isPurchasable: true,
  parts: []
};

const cartState: CartState = {
  ids: ['86739', '882728'],
  items: [
    {
      item: testPartData,
      quantity: 1,
      verified: true,
      verificationComments: []
    },
    {
      item: testPartData,
      quantity: 1,
      verified: true,
      verificationComments: []
    }
  ],
  lastUpdatedTimestamp: Date.now()
};

describe('Cart Helpers', () => {
  it('Cart should be unverified if too much time has passed', () => {
    const cartState: CartState = defaultCartState;
    cartState.lastVerifiedTimestamp = Date.now() - 600000;
    cartState.items.push({
      item: testPartData,
      quantity: 1,
      verified: true,
      verificationComments: []
    });
    expect(isCartVerificationExpired(cartState));
  });
  it('Cart should be unverified if the cart state is null', () => {
    expect(isCartVerified(null)).toEqual(false);
  });
  it('A cart should be verified if all the items in it are verified', () => {
    const sampleState = cartState;
    sampleState.lastVerifiedTimestamp = Date.now();
    expect(isCartVerified(sampleState));
  });
  it('A cart should be unverified if any item in it is unverified', () => {
    const sampleState = cartState;
    sampleState.lastVerifiedTimestamp = Date.now();
    sampleState.items[0].verified = false;
    expect(!isCartVerified(sampleState));
  });

  it('Should show the cart icon if on the Parts, Maintenance, Fleet, Notifications, or Dashboard pages, but not for the others', () => {
    Object.values(JBTRoutes).forEach((route) => {
      if (
        route.includes('/dashboard') ||
        route.includes('/parts') ||
        (route.includes('/maintenance') && !route.includes('/maintenance-schedule')) ||
        route.includes('/notifications') ||
        route.includes('/fleet')
      ) {
        expect(shouldShowCartAndProductIcons(route)).toBe(true);
      } else {
        console.warn('route: ', route);
        expect(shouldShowCartAndProductIcons(route)).toBe(false);
      }
    });
  });

  it('Should not show Language dropdown for User Management, Machine Management & Admin pages, but not for the others', () => {
    Object.values(JBTRoutes).forEach((route) => {
      if (
        route.includes('/machine-management') ||
        route.includes('/user-management') ||
        route.includes('/onboarding') ||
        route.includes('/admin') ||
        route.includes('/login')
      ) {
        expect(shouldNotShowLanguageDropdown(route)).toBe(true);
      } else {
        console.warn('route: ', route);
        expect(shouldNotShowLanguageDropdown(route)).toBe(false);
      }
    });
  });
});
