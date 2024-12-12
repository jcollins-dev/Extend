// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';
import CheckHierarchy from './CheckHierarchy';

const RenderComponent = () => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.machineManagementHierarchy]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.machineManagementHierarchy}>
            <CheckHierarchy />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('<CheckHierarchy />', () => {
  test('Should render', () => {
    render(RenderComponent());
    screen.debug();
  });
});
