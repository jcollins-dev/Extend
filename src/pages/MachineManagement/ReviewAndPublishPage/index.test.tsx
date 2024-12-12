import React from 'react';
import ReactDOM from 'react-dom';
import ReviewAndPublishPage from '.';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { JBTRoutes } from 'constants/routes';

describe('<ReviewAndPublishPage />', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[JBTRoutes.machineReviewAndPublish.replace(':machineId', '1')]}
        >
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.machineReviewAndPublish.replace(':machineId', '1')}>
              <ReviewAndPublishPage />
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
