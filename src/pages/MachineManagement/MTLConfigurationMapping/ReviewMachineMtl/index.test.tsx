import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';

import { JBTRoutes } from 'constants/routes';
import ReviewMasterTagList from '.';

it('It should mount', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.machineManagement}>
            <ReviewMasterTagList />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
