import { renderHook } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import useKeypress from './useKeypress';

describe('useKeypress', () => {
  test('Calls callback when Enter button is pressed, and removes listener when unmounted', () => {
    const mockCallback = jest.fn();

    const { unmount } = renderHook(() => useKeypress('Enter', mockCallback));

    fireEvent.keyUp(window, { key: 'Enter', code: 'Enter' });
    expect(mockCallback).toHaveBeenCalledTimes(1);

    unmount();

    fireEvent.keyUp(window, { key: 'Enter', code: 'Enter' });
    expect(mockCallback).toHaveBeenCalledTimes(1); // Still only called once
  });
});
