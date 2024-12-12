import { act, renderHook } from '@testing-library/react-hooks';
import { useCooldown } from 'hooks';

describe('useCooldown hook', () => {
  it('It should update the item after the cooldown time', () => {
    jest.useFakeTimers();
    const mockUpdateFunc = jest.fn();

    const { result } = renderHook(() => useCooldown<string>(500, mockUpdateFunc, ''));

    act(() => {
      result.current('test');
    });

    expect(mockUpdateFunc).not.toBeCalled();

    jest.runAllTimers();

    expect(mockUpdateFunc).toBeCalled();
    expect(mockUpdateFunc).toHaveBeenCalledTimes(1);
  });
});
