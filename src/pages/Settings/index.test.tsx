import React from 'react';
import ReactDOM from 'react-dom';
import Settings from '.';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';

// Store
import { default as store } from 'store';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Settings />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
