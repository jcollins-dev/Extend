import { renderHook } from '@testing-library/react-hooks';
import useColorMap from './useColorMap';

describe('useColorMap', () => {
  test('Returns correct color for a given id', () => {
    const sourceColors = ['red', 'green', 'blue'];
    const { result } = renderHook(() => useColorMap(sourceColors));

    // First call returns the first color
    expect(result.current('1')).toEqual('red');

    // Calling same id again immediately returns the same color
    expect(result.current('1')).toEqual('red');

    // Calling a different id returns the next color
    expect(result.current('2')).toEqual('green');

    // Calling a different id returns the next color
    expect(result.current('3')).toEqual('blue');

    // Calling same id again returns the same color
    expect(result.current('2')).toEqual('green');
    expect(result.current('3')).toEqual('blue');
  });

  it('Returns a random color when the source color list is exhausted', () => {
    const sourceColors = ['red', 'green', 'blue'];
    const { result } = renderHook(() => useColorMap(sourceColors));

    // Call with 3 ids to extinguish the list
    expect(result.current('1')).toEqual('red');
    expect(result.current('2')).toEqual('green');
    expect(result.current('3')).toEqual('blue');

    // Next call has no color in the list
    const nextColor = result.current('4');

    // It is not within the original array of source colors
    expect(sourceColors).not.toContain(nextColor);

    // Its a HSL color
    expect(nextColor).toMatch(/hsl\([0-9]*, [0-9]*%, [0-9]*%\)/);

    // Calling it again returns the same color
    expect(result.current('4')).toEqual(nextColor);
  });
});
