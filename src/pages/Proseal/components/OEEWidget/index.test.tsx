import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import store from 'store';
import theme from 'themes';
import OeeWidget from '.';

describe('OeeWidget', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <OeeWidget availabilityRate={0.7} oeeStatus={0.39} performanceRate={0.7} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
