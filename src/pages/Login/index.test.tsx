import React from 'react';
import ReactDOM from 'react-dom';
import Login from '.';

import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';

// Store
import { default as store } from 'store';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
