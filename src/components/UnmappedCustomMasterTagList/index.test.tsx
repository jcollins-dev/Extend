import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import UnmappedCustomMasterTagList from '.';

describe('Master Tag List Table', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UnmappedCustomMasterTagList data={[]} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
