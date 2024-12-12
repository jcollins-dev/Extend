import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import store from 'store';
import theme from 'themes';
import StepsOverTime from '.';

describe('StepsOverTime', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <StepsOverTime tabs={[]} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
