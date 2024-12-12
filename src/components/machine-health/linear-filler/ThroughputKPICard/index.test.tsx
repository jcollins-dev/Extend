import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import store from 'store';
import theme from 'themes';
import ThroughputKPICard from '.';

describe('ThroughputKPICard', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ThroughputKPICard />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
