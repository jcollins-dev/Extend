import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

import { AlertDataSource } from './AlertDataSource';
import { default as theme } from 'themes';

describe('Alert Data Source', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertDataSource tagList={[]} handleSelect={jest.fn()} onClose={jest.fn()} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
