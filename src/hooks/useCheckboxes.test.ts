import { renderHook, act } from '@testing-library/react-hooks';
import useCheckboxes from './useCheckboxes';

describe('useCheckboxes', () => {
  test('Sets correct checkboxes to active when clicked', () => {
    // 1 and 2 checked by default
    const { result } = renderHook(() => useCheckboxes(['1', '2']));

    act(() => {
      // Uncheck 1
      result.current.onCheckboxChange('1', false);
    });

    // Only 2 is checked
    expect(result.current.checkedCheckboxes).toEqual(['2']);

    // Check 3
    act(() => {
      result.current.onCheckboxChange('3', true);
    });

    // 2 and 3 are checked
    expect(result.current.checkedCheckboxes).toEqual(['2', '3']);
  });
});
