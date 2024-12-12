import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { JBTRoutes } from 'constants/routes';
import OnboardingPage from '.';

describe('<OnboardingPage />', () => {
  it('Renders', () => {
    render(
        <Provider store={store}>
        <MemoryRouter initialEntries={[JBTRoutes.onboardingPage]}>
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.onboardingPage}>
              <OnboardingPage />
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
