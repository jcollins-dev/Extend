import { renderHook } from '@testing-library/react-hooks';
import { useFilter } from 'hooks';

import { BaseType } from 'types';

interface TestItem extends BaseType {
  name: string;
  price: number;
  animal: string;
  types: string[];
}

const defaultFilterState = [{ property: 'types', value: '' }];

const testList: TestItem[] = [
  {
    name: 'Item Name 1',
    price: 400,
    animal: 'whale',
    types: ['water']
  },
  {
    name: 'Item Name 2',
    price: 150,
    animal: 'dragon',
    types: ['land', 'air']
  },
  {
    name: 'Item Name 3',
    price: 623,
    animal: 'snake',
    types: ['land', 'water']
  }
];

describe('useFilter hook', () => {
  it('It should return the list unchanged if given no filter criteria', () => {
    const { result } = renderHook(() => useFilter<TestItem>(defaultFilterState, testList));

    expect(result.current.length).toBe(testList.length);

    result.current.forEach((item, i) => {
      expect(item.name).toBe(testList[i].name);
    });
  });

  it('It should return list of size two with elements that have the given type', () => {
    const updatedFilterState = [{ property: 'types', value: 'land' }];
    const { result } = renderHook(() => useFilter<TestItem>(updatedFilterState, testList));

    expect(result.current.length).toBe(2);

    expect(result.current[0].animal).toBe('dragon');
    expect(result.current[0].name).toBe('Item Name 2');
    expect(result.current[1].animal).toBe('snake');
    expect(result.current[1].name).toBe('Item Name 3');
  });
});
