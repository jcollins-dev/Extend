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
import PartDetail from '.';

// State management
import { default as store } from 'store';
import { authActions } from 'actions';

it('It should mount', () => {
  const div = document.createElement('div');
  store.dispatch({ type: authActions.SET_TOKENS, authToken: 'password', refreshToken: null });
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.partsMachine.replace(':machineId', '1')]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.partsMachine}>
            <PartDetail />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
