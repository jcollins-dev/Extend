import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import WaitTimeWidget from '.';

describe('UtilityMetricsWidget', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <WaitTimeWidget />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
