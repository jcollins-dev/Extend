import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import DriveSystemCard from '.';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

describe('DriveSystemCard', () => {
  it('renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <DriveSystemCard machineId="test-id" />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
