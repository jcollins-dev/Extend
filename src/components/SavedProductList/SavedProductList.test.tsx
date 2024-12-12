import React from 'react';
import ReactDOM from 'react-dom';
import SavedProductList from './SavedProductList';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../themes';
import { default as store } from 'store';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SavedProductList />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
