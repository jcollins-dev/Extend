import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import AlertDetailCard from './index';
import { AlertCriticality } from 'types/machine-health/alerts';

describe('AlertDetailCard', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertDetailCard
              alertId={'test'}
              description={'Alert Description'}
              isLoading={false}
              subcomponent={'Heat Exchanger'}
              importance={AlertCriticality.High}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
