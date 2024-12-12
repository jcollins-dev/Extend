import { currency } from 'helpers';

const testNumber = 20130927.2331;

describe('Currency helper', () => {
  it('It should default to USD with a comma delimited every 3 orders of magnitude, a dot to delineate the decimal values, and two decimal points', () => {
    const usd = currency(testNumber);
    expect(usd).toBe('$20,130,927.23');
  });
});
