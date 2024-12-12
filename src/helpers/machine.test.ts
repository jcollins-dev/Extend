import { mapBusinessUnit } from './machine';

describe('Machine Utilities', () => {
  it('Should correctly get back undefined when called with non existant business unit', () => {
    expect(mapBusinessUnit(99)).toBe(undefined);
  });
});
