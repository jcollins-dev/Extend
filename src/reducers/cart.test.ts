import { defaultCartState } from './cart';
import { cartActions } from 'actions';
import { default as cartReducer } from './cart';
import { CartAction, CartPurchasable, CartState, SFCart } from 'types/parts/cart';
import { UNIVERSAL_PRODUCTS_KEY } from 'constants/cart';

const testProductData = {
  id: 'test-id-1',
  sku: 'AT02710',
  assets: [],
  description: 'MHS CORE ASSY,AV-X/AV-M',
  stock: 1,
  leadTime: 143,
  price: 0,
  priceUnit: '',
  businessUnit: 'avure',
  isPurchasable: true
};

const testProductData2 = {
  id: 'test-id-2',
  sku: 'AT02710',
  assets: [],
  description: 'MHS CORE ASSY,AV-X/AV-M',
  stock: 1,
  leadTime: 143,
  price: 0,
  priceUnit: '',
  businessUnit: 'avure',
  isPurchasable: true
};

const initialCartStateWithProducts: CartState = {
  ids: ['test-id-1'],
  items: [
    {
      item: testProductData,
      quantity: 2,
      verified: false,
      verificationComments: [],
      groupId: UNIVERSAL_PRODUCTS_KEY
    } as CartPurchasable
  ],
  sfCart: {} as SFCart,
  lastUpdatedTimestamp: Date.now(),
  userId: 'test-usr-1'
} as CartState;

describe('Cart Reducer', () => {
  it('It should return an empty array of purchasables if it is empty', () => {
    expect(cartReducer(undefined, { type: '', item: undefined, quantity: 0 })).toEqual(
      defaultCartState
    );
  });
  it('It should add an item to the cart', () => {
    const resultCartState = cartReducer(defaultCartState, {
      type: cartActions.ADD_TO_CART,
      item: testProductData,
      quantity: 1
    } as CartAction);
    expect(resultCartState.items[0].item).toEqual(testProductData);
  });
  it('It should add an item to the cart one time if quantity is unspecified', () => {
    const resultCartState = cartReducer(defaultCartState, {
      type: cartActions.ADD_TO_CART,
      item: testProductData
    } as CartAction);
    expect(resultCartState.items[0].quantity).toEqual(1);
  });
  it('It should add multiple items to the cart', () => {
    const resultCartState = cartReducer(defaultCartState, {
      type: cartActions.ADD_TO_CART,
      item: testProductData,
      quantity: 2
    } as CartAction);
    expect(resultCartState.items[0].item).toEqual(testProductData);
    expect(resultCartState.items[0].quantity).toEqual(2);
  });
  it("It should set an item's quantity correctly", () => {
    const resultCartState = cartReducer(initialCartStateWithProducts, {
      type: cartActions.SET_ITEM_QUANTITY,
      item: testProductData,
      quantity: 7,
      sfCaft: {} as SFCart
    } as CartAction);
    expect(resultCartState.items[0].quantity).toEqual(7);
  });
  it("It should not allow setting an item's quantity below 0", () => {
    const resultCartState = cartReducer(initialCartStateWithProducts, {
      type: cartActions.SET_ITEM_QUANTITY,
      item: testProductData,
      quantity: -1
    } as CartAction);
    expect(resultCartState.items[0].quantity).toEqual(
      initialCartStateWithProducts.items[0].quantity
    );
  });
  it('It should remove an item from the cart', () => {
    const resultCartState = cartReducer(initialCartStateWithProducts, {
      type: cartActions.REMOVE_FROM_CART,
      item: testProductData,
      quantity: 1
    } as CartAction);
    expect(resultCartState.ids).toEqual(['test-id-1']);
    expect(resultCartState.items[0].quantity).toEqual(1);
  });
  it('It should remove the item from the cart entirely if quantity is fully removed', () => {
    const resultCartState = cartReducer(initialCartStateWithProducts, {
      type: cartActions.REMOVE_FROM_CART,
      item: testProductData,
      quantity: 2
    } as CartAction);
    expect(resultCartState.ids).toEqual([]);
  });
  it('It should empty the cart', () => {
    const resultCartState = cartReducer(initialCartStateWithProducts, {
      type: cartActions.EMPTY_CART
    });
    expect(resultCartState.ids.length).toEqual(0);
  });
});
