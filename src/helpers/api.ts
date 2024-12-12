import { camelCaseKeysDeep, snakeCaseKeysDeep } from './object';
import { BaseType } from 'types';
import { Part, PartTransformResponse } from 'types/parts';
import { MaintenanceEvent } from 'types/maintenance';

// camelCase response keys recursively
// TODO: add logic to do proper type transform and validation
export const defaultTransformResponse = <T>(response: BaseType): T =>
  camelCaseKeysDeep(response) as unknown as T;

// TODO: remove this when we're receiving proper datatypes for the below
export const productTransformResponse = <T extends Part>(response: BaseType): T => {
  const transformedResponse = defaultTransformResponse(response) as PartTransformResponse;

  const patchedResponse = {
    ...transformedResponse,
    price: parseFloat(transformedResponse?.price ?? 0),
    stock: parseInt(transformedResponse?.stock ?? 0),
    leadTime: parseFloat(transformedResponse?.leadTime ?? 0)
  };

  return patchedResponse as T;
};

export const censorMaintenanceEventUpdates = (args: MaintenanceEvent[]): MaintenanceEvent[] => {
  const censoredEvents: MaintenanceEvent[] = [];

  for (const event of args) {
    delete event.purchasables;
    censoredEvents.push(event);
  }

  return censoredEvents;
};

export const addArgsToPath = (args: BaseType): string => {
  if (Object.keys(args).length === 0) return '';

  let queryParams = '?';
  // Snake_case the params (so the backend is happy)
  const snakedArgs = snakeCaseKeysDeep(args);

  for (const k in snakedArgs) {
    const v = (snakedArgs as BaseType)[k];
    if (v && Array.isArray(v)) {
      for (const i in v) {
        if (v[i] !== '') {
          queryParams = queryParams.concat(`${k}=${encodeURIComponent(v[i].toString())}&`);
        }
      }
    } else if (
      // Make sure v has a value, or do not include it
      (v && typeof v === 'boolean') ||
      typeof v === 'number' ||
      (v && typeof v === 'string')
    ) {
      queryParams = queryParams.concat(`${k}=${encodeURIComponent(v.toString())}&`);
    }
  }
  const trailing = queryParams.substring(queryParams.length - 1, queryParams.length);
  if (trailing === '&') {
    queryParams = queryParams.substring(0, queryParams.length - 1);
  }
  return queryParams;
};
