import { renderHook, act } from '@testing-library/react-hooks';
import usePaginatedQueryOffset from './usePaginatedQueryOffset';

describe('usePaginatedQueryOffset', () => {
  test('Intially returns offset of 0, updates offset when page changes', () => {
    const { result } = renderHook(() => usePaginatedQueryOffset());
    // Page number is initially 0
    expect(result.current.pageNumber).toEqual(0);

    // Move to page 5
    act(() => {
      result.current.onPageChange(5);
    });

    // Page number is now 50
    expect(result.current.pageNumber).toEqual(5);
  });
});
