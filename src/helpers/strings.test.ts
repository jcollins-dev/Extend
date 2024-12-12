import { capitalizeFirst, digitLeadingZero, unUnderscore } from 'helpers';

describe('Strings Helper - capitalizeFirst', () => {
  it('Should capitalize first character of a string', () => {
    expect(capitalizeFirst('some string')).toBe('Some string');
    expect(capitalizeFirst('Some String')).toBe('Some String');
    expect(capitalizeFirst('5 this starts with a number')).toBe('5 this starts with a number');
    expect(capitalizeFirst('')).toBe('');
  });
});

describe('Strings helper - digitLeadingZero', () => {
  it('Should pad a single digit number with a leading zero', () => {
    expect(digitLeadingZero(1)).toBe('01');
    expect(digitLeadingZero(20)).toBe('20');
    expect(digitLeadingZero(-1)).toBe('-01');
    expect(digitLeadingZero(0)).toBe('00');
    expect(digitLeadingZero(0.01)).toBe('0.01');
  });
});

describe('Strings helper - unUnderscore', () => {
  it('Should remove underscores and captilze the first letter', () => {
    expect(unUnderscore('meatball_sub')).toBe('Meatball sub');
    expect(unUnderscore('CANDY')).toBe('Candy');
    expect(unUnderscore('PrOpEr_GENtle_pERSoN')).toBe('Proper gentle person');
  });
});
