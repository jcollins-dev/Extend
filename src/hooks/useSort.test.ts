import { renderHook } from '@testing-library/react-hooks';
import { useSort } from 'hooks';

import { BaseType, SortState } from 'types';

interface TestItem extends BaseType {
  name: string;
  price: number;
  animal: string;
}

const defaultSortState: Record<string, SortState> = {
  name: SortState.unsorted,
  price: SortState.unsorted,
  animal: SortState.unsorted
};

const testList: TestItem[] = [
  {
    name: 'Item Name 1',
    price: 400,
    animal: 'zebra'
  },
  {
    name: 'Item Name 2',
    price: 150,
    animal: 'dragon'
  },
  {
    name: 'Item Name 3',
    price: 623,
    animal: 'cat'
  }
];

describe('useSort hook', () => {
  it('It should return the list as it was if given no sorting criteria', () => {
    const { result } = renderHook(() => useSort<TestItem>(defaultSortState, testList));

    expect(result.current.length).toBe(testList.length);

    result.current.forEach((item, i) => {
      expect(item.name).toBe(testList[i].name);
    });
  });

  it('It should return list in ascending order by the animal property', () => {
    const updatedSortState = {
      ...defaultSortState,
      animal: SortState.ascending
    };
    const { result } = renderHook(() => useSort<TestItem>(updatedSortState, testList));

    expect(result.current.length).toBe(testList.length);

    expect(result.current[0].animal).toBe('cat');
    expect(result.current[0].name).toBe('Item Name 3');
    expect(result.current[1].animal).toBe('dragon');
    expect(result.current[1].name).toBe('Item Name 2');
    expect(result.current[2].animal).toBe('zebra');
    expect(result.current[2].name).toBe('Item Name 1');
  });
});
