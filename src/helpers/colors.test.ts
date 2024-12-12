import { getRandomColor, toString as hex } from 'helpers/colors';

describe('Colors helper', () => {
  it('RGB color should match its #RRGGBB hex string', () => {
    const hexColors: string[] = [hex([255, 87, 51]), hex([4, 159, 83]), hex([181, 63, 138])];
    expect(hexColors).toEqual(['#ff5733', '#049f53', '#b53f8a']);
  });

  it('getRandomColor returns an #RRGGBB hex string', () => {
    const color = getRandomColor();
    expect(/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)).toBeTruthy();
  });
});
