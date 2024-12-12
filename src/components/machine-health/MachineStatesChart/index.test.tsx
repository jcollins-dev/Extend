import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MachineStatesChart from '.';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';

describe('MachineStatesChart', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineStatesChart states={[]} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
