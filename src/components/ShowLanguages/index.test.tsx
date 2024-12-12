import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { default as store } from 'store';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import ShowLanguages from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShowLanguages />
        </Provider>
      </ThemeProvider>
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
