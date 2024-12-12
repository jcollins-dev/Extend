import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AlertQueryBuilder from '.';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

describe('AlertQueryBuilder', () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertQueryBuilder onDataChange={jest.fn()} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
