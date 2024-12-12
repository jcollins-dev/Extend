// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { Wizard } from 'react-use-wizard';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';
import { ReviewHierarchy } from './ReviewHierarchy';

const RenderComponent = () => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.machineManagementHierarchy]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.machineManagementHierarchy}>
            <Wizard>
              <ReviewHierarchy machineId={'test'} />
            </Wizard>
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('<ReviewHierarchy />', () => {
  test('Should render', () => {
    render(RenderComponent());
    screen.debug();
  });
});
