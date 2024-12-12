// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

// Components
import MachineManagement from '.';

// State management
import { default as store } from 'store';
import { authActions } from 'actions';

const DrawMachineManagement = () => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.machineManagement]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.machineManagement}>
            <MachineManagement />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('<MachineManagement />', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    store.dispatch({ type: authActions.SET_TOKENS, authToken: 'password', refreshToken: null });
    ReactDOM.render(DrawMachineManagement(), div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
