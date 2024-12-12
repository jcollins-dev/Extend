import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import PropertyFilters from './PropertyFilters';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PropertyFilters setFiltersSelected={jest.fn()} />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
