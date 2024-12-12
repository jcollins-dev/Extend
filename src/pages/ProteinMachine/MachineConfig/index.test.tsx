import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MachineConfig from '.';
import { Provider } from 'react-redux';
import store from 'store';

describe('MachineConfig', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineConfig isMachinePerformanceActive={false} machineWidgets={[]} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
