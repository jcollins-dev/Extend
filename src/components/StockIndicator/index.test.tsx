import React from 'react';
import { render } from '@testing-library/react';
import StockIndicator from '.';

describe('Stock Indicator Component', () => {
  it('Should Render', () => {
    render(<StockIndicator purchasable={undefined} />);
  });
});
