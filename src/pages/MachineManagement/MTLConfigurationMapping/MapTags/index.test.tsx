import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { JBTRoutes } from 'constants/routes';
import MapTags from '.';
import { Wizard } from 'react-use-wizard';

describe('<MapTags />', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[JBTRoutes.machineManagement]}>
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.machineManagement}>
              <Wizard>
                <MapTags />
              </Wizard>
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
