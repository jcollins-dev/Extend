import {convertRemToPixels} from './styling';

describe('Strings Helper - capitalizeFirst', () => {
  it('Should convert rem to PX successfully', () => {
    expect(convertRemToPixels(5)).toEqual(5*16);
  })
})