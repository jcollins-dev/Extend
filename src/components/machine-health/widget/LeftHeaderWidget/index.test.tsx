import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import LeftHeaderWidget from 'components/machine-health/widget/LeftHeaderWidget';

describe('LeftHeaderWidget', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <LeftHeaderWidget title="Sample" values={[{ value: 500, unit: 'g' }]} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
