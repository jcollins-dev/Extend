import { renderHook } from '@testing-library/react-hooks';
import { useSearch } from 'hooks';

import { BaseType } from 'types';

interface TestItem extends BaseType {
  name: string;
  price: number;
  animal: string;
}

const testList: TestItem[] = [
  {
    name: 'Item tiger',
    price: 400,
    animal: 'big kitty'
  },
  {
    name: 'Item Name 2',
    price: 150,
    animal: 'snow leopard'
  },
  {
    name: 'Item Name 3',
    price: 623,
    animal: 'bengal tiger'
  }
];

describe('useSearch hook', () => {
  it('It should return the list unchanged if given no search criteria', () => {
    const searchByProps = ['name', 'animal'];
    const { result } = renderHook(() => useSearch<TestItem>('', testList, searchByProps));

    expect(result.current.length).toBe(testList.length);

    result.current.forEach((item, i) => {
      expect(item.name).toBe(testList[i].name);
    });
  });

  it('It should return all items from original list if given search criteria that is present in all 3 name properties', () => {
    const searchByProps = ['name', 'animal'];
    const { result } = renderHook(() => useSearch<TestItem>('Item', testList, searchByProps));

    expect(result.current.length).toBe(3);

    result.current.forEach((item, i) => {
      expect(item.name).toBe(testList[i].name);
    });
  });

  it('It should return 2 items from original list for search criteria that matches one property value in two elements', () => {
    const searchByProps = ['name', 'animal'];
    const { result } = renderHook(() => useSearch<TestItem>('tiger', testList, searchByProps));

    expect(result.current.length).toBe(2);

    expect(result.current[0].animal).toBe('big kitty');
    expect(result.current[0].name).toBe('Item tiger');
    expect(result.current[1].animal).toBe('bengal tiger');
    expect(result.current[1].name).toBe('Item Name 3');
  });
});
