import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import ConfiguredMatrixWidgetGroup from '.';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

describe('ConfiguredMatrixWidgetGroup', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ConfiguredMatrixWidgetGroup label="TEST-LABEL" machineId="test-machine-id" />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
