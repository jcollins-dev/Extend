import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import NewTemplate from '.';

describe('NewTemplate', () => {
  it('Renders', () => {
    const mock = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <NewTemplate onClick={mock} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
