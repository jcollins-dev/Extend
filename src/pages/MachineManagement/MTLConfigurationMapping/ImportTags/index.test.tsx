import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { JBTRoutes } from 'constants/routes';
import { Wizard } from 'react-use-wizard';
import ImportTags from '.';

describe('<MasterTagList />', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[JBTRoutes.machineManagement]}>
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.machineManagement}>
              <Wizard>
                <ImportTags />
              </Wizard>
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
