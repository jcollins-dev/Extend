import {
  iopsApi,
  manageCartState,
  defaultPatchQuery,
  defaultPostQuery,
  defaultPatchQueryNoSkakeCase,
  defaultPutQuery,
  defaultDeleteQuery
} from 'api';
import { snakeCaseKeysDeep } from 'helpers';
import { WidgetTableDataItem } from 'types/machine-health';
import { MaintenanceEvent, MaintenanceEventStatus } from 'types/maintenance';
import { OrderInputWithSFFlag, Product } from 'types/parts';
import { CartPurchasable, CartVerificationComment } from 'types/parts/cart';

describe('API', () => {
  const api = iopsApi;
  it('It should be configured correctly', () => {
    expect(api.reducerPath).toBe('iopsApi');
    // check for other configuration as this grows
  });

  // perform integration tests here
});

describe('defaultPostQuery', () => {
  it('should return a post query', () => {
    const order = {
      billTo: {
        firstName: 'test',
        lastName: 'test',
        streetAddress: 'test',
        city: 'test',
        postalCode: 'test',
        country: 'test'
      },
      shipTo: {
        lastName: 'test',
        streetAddress: 'test',
        city: 'test',
        postalCode: 'test',
        country: 'test'
      },
      creator: 'test',
      approver: 'test',
      orders: []
    };
    const result = defaultPostQuery<OrderInputWithSFFlag>(order, '/fps/order');
    expect(result).toEqual({
      body: snakeCaseKeysDeep(order),
      method: 'POST',
      url: '/fps/order'
    });
  });
});

describe('defaultPatchQuery', () => {
  it('should return a patch query', () => {
    const events = [
      {
        id: '12',
        machineId: '123',
        suggestedPriority: 1,
        priority: 999,
        maintenanceDescription: 'test',
        owner: 'test',
        status: MaintenanceEventStatus.NotComplete
      }
    ];
    const result = defaultPatchQuery<MaintenanceEvent[]>(events, '/fps/maintenance-events');
    expect(result).toEqual({
      body: snakeCaseKeysDeep(events),
      method: 'PATCH',
      url: '/fps/maintenance-events'
    });
  });
});

describe('defaultPatchQueryNoSkakeCase', () => {
  it('should return a patch query without converting the body to snake case', () => {
    const events = [
      {
        id: '12',
        machineId: '123',
        suggestedPriority: 1,
        priority: 999,
        maintenanceDescription: 'test',
        owner: 'test',
        status: MaintenanceEventStatus.NotComplete
      }
    ];
    const result = defaultPatchQueryNoSkakeCase<MaintenanceEvent[]>(
      events,
      '/fps/maintenance-events'
    );
    expect(result).toEqual({
      body: events,
      method: 'PATCH',
      url: '/fps/maintenance-events'
    });
  });
});

describe('defaultPutQuery', () => {
  it('should return a put query', () => {
    const items = [
      {
        id: '12',
        members: [],
        name: 'test',
        tags: []
      }
    ];
    const result = defaultPutQuery<WidgetTableDataItem[]>(items, '/mh/v1/machines/1/widgets');
    expect(result).toEqual({
      body: snakeCaseKeysDeep(items),
      method: 'PUT',
      url: '/mh/v1/machines/1/widgets'
    });
  });
});

describe('defaultDeleteQuery', () => {
  it('should return a delete query', () => {
    const result = defaultDeleteQuery(`/mh/v1/business-units/1/configured-tags/1`);
    expect(result).toEqual({
      method: 'DELETE',
      url: `/mh/v1/business-units/1/configured-tags/1`
    });
  });
});

describe('Manage Cart State', () => {
  it("should update the cart's state", () => {
    const product: Product = {
      id: '123',
      sku: '123',
      description: 'test',
      leadTime: 1,
      stock: 1
    };

    const items: CartPurchasable[] = [
      {
        item: {
          ...product,
          description: 'test2',
          stock: 3
        },
        quantity: 1,
        verified: true,
        verificationComments: [CartVerificationComment.PRICE_CHANGE]
      }
    ];
    const patch = {
      accountId: '123',
      product,
      cart: {
        ids: ['123'],
        items,
        sfCart: {
          cartItems: [],
          cartSummary: {
            accountId: '123',
            cartId: '123',
            grandTotalAmount: '10000',
            name: 'my cart',
            ownerId: '123',
            status: 'Open',
            type: 'Standard',
            totalProductCount: '1'
          }
        },
        lastUpdatedTimestamp: 1
      },
      quantity: 1
    };

    const updatedPost = {
      cartId: 'cartId',
      cartItemId: 'cartItemId',
      productId: 'productId',
      accountId: 'accountId',
      quantity: 1,
      status: 200,
      type: 'type'
    };

    const result = manageCartState(patch, updatedPost);

    const expected = {
      cartItems: [
        {
          cartItem: {
            cartId: 'cartId',
            cartItemId: 'cartItemId',
            productId: 'productId',
            quantity: 1,
            type: 'type'
          }
        }
      ],
      cartSummary: {
        accountId: '123',
        cartId: 'cartId',
        grandTotalAmount: '10000',
        name: 'my cart',
        ownerId: '123',
        status: 'Open',
        totalProductCount: '1',
        type: 'Standard'
      }
    };

    expect(result).toEqual(expected);
  });
});
