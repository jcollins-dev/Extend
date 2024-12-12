import { getUniqueListItems } from 'helpers';

const testList: string[] = ['manifold', 'caster', 'caster', 'belt', 'manifold', 'belt', 'caster'];

describe('List helper - getUniqueListItems', () => {
  it('It should return a list with only the 3 unique strings', () => {
    const result = getUniqueListItems(testList);
    expect(result.length).toBe(3);
    expect(result.filter((item) => item === 'belt').length).toBe(1);
    expect(result.filter((item) => item === 'caster').length).toBe(1);
    expect(result.filter((item) => item === 'manifold').length).toBe(1);
  });
});
