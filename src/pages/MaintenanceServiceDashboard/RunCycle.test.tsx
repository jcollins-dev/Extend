import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import { RunCycle } from './RunCycle';

describe('Run Cycle', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <RunCycle allEvents={null} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
