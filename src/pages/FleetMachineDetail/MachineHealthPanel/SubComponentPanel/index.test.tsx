import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import SubComponentPanel from '.';

describe('Sub Component Panel', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <SubComponentPanel />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
