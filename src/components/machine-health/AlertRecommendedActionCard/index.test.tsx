import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import AlertRecommendedActionCard from './index';

describe('AlertRecommendedActionCard', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertRecommendedActionCard detailedInstructions="test" />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
