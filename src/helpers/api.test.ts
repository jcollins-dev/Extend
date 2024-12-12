import {
  addArgsToPath,
  censorMaintenanceEventUpdates,
  defaultTransformResponse,
  productTransformResponse
} from './api';
import { MaintenanceEvent, MaintenanceEventStatus } from 'types/maintenance';

describe('addArgsToPath', () => {
  it('should return empty string if no args', () => {
    expect(addArgsToPath({})).toBe('');
  });

  it('should return snake cased params from one arg', () => {
    expect(addArgsToPath({ test: 'test' })).toBe('?test=test');
  });

  it('should return snake cased params separated by & from many args', () => {
    expect(addArgsToPath({ test: 'test', param: 'param' })).toBe('?test=test&param=param');
  });
});

describe('censorMaintenanceEventUpdates', () => {
  it('should return empty array if no args', () => {
    expect(censorMaintenanceEventUpdates([])).toEqual([]);
  });

  it('should return array with purchasables removed', () => {
    const event: MaintenanceEvent = {
      id: '1',
      priority: 1,
      owner: 'owner',
      status: MaintenanceEventStatus.Completed,
      purchasables: [
        {
          maintenanceEventId: '1',
          purchasableId: '1',
          quantity: 1
        }
      ]
    };

    expect(censorMaintenanceEventUpdates([event])).toEqual([
      { id: '1', priority: 1, owner: 'owner', status: MaintenanceEventStatus.Completed }
    ]);
  });
});

describe('defaultTransformResponse', () => {
  it('should return a camelCase object when given a snake_case object', () => {
    const snakeCaseObject = {
      test_param: 'test'
    };

    const camelCaseObject = {
      testParam: 'test'
    };

    expect(defaultTransformResponse(snakeCaseObject)).toEqual(camelCaseObject);
  });

  it('should return a camelCase object when given a snake_case object with nested objects', () => {
    const snakeCaseObject = {
      test_param: 'test',
      nested: {
        test_param: 'test'
      }
    };
    const camelCaseObject = {
      testParam: 'test',
      nested: {
        testParam: 'test'
      }
    };
    expect(defaultTransformResponse(snakeCaseObject)).toEqual(camelCaseObject);
  });
});

describe('productTransformResponse', () => {
  it('should return a camelCase object when given a snake_case object with price, stock, and leadTime keys', () => {
    const snakeCaseObject = {
      test_param: 'test'
    };
    const camelCaseObject = {
      testParam: 'test',
      price: 0,
      stock: 0,
      leadTime: 0
    };
    expect(productTransformResponse(snakeCaseObject)).toEqual(camelCaseObject);
  });
});
