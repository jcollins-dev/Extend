import { camelCaseKeysDeep, hasOwnPropertyString, mapKeysDeep, snakeCaseKeysDeep } from 'helpers';
import { BaseType } from 'types';

interface TestInterface extends BaseType {
  prop1: string;
  prop2: string;
}

const testObject1: TestInterface = {
  prop1: 'test1',
  prop2: 'test2'
};

describe('Object helper - hasOwnPropertyString', () => {
  it('It should find property', () => {
    const result = hasOwnPropertyString(testObject1, 'prop1');
    expect(result).toBe(true);
  });

  it('It should not find property', () => {
    const result = hasOwnPropertyString(testObject1, 'prop3');
    expect(result).toBe(false);
  });
});

describe('Object helper - mapKeysDeep', () => {
  it('It should perform the given action on the keys (e.g., keys in reverse order)', () => {
    const testObj = {
      big_cat: 'tiger',
      little_dog: 'shiba inu'
    };

    // Reverse the keys
    const result = mapKeysDeep(testObj, (value, key) => key.split('').reverse().join(''));

    expect(hasOwnPropertyString(result as BaseType, 'tac_gib')).toBe(true);
    expect(hasOwnPropertyString(result as BaseType, 'god_elttil')).toBe(true);
  });
});

describe('Object helper - camelCaseKeysDeep', () => {
  it('It should convert snake_case to camelCase', () => {
    const testObj = {
      big_cat: {
        le_tigre: 'tiger',
        mountain_cat: 'mountain lion'
      },
      little_dog: 'shiba inu'
    };

    const result = camelCaseKeysDeep(testObj);

    expect(hasOwnPropertyString(result as BaseType, 'bigCat')).toBe(true);
    expect(hasOwnPropertyString((result as BaseType)['bigCat'] as BaseType, 'leTigre')).toBe(true);
    expect(hasOwnPropertyString(result as BaseType, 'littleDog')).toBe(true);
  });
});

describe('Object helper - snakeCaseKeysDeep', () => {
  it('It should convert camelCase to snake_case', () => {
    const testObj = {
      bigCat: {
        leTigre: 'tiger',
        mountainCat: 'mountain lion'
      },
      littleDog: 'shiba inu'
    };

    const result = snakeCaseKeysDeep(testObj);

    expect(hasOwnPropertyString(result as BaseType, 'big_cat')).toBe(true);
    expect(hasOwnPropertyString((result as BaseType)['big_cat'] as BaseType, 'le_tigre')).toBe(
      true
    );
    expect(hasOwnPropertyString(result as BaseType, 'little_dog')).toBe(true);
  });
});
