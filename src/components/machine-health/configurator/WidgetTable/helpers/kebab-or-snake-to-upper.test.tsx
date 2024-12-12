import kebabOrSnakeToUpperCase from './kebab-or-snake-to-upper';

describe('kebab or snake case to upper case', () => {
  it('transforms snake case strings into upper case string', () => {
    const result = kebabOrSnakeToUpperCase('test_string');

    expect(result).toEqual('Test String');
  });

  it('transforms kebab case strings into upper case string', () => {
    const result = kebabOrSnakeToUpperCase('test-string');

    expect(result).toEqual('Test String');
  });
});
