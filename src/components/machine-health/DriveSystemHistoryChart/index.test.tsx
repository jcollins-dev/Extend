import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import DriveSystemHistoryChart from '.';
import store from 'store';

describe('DriveSystemHistoryChart', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <DriveSystemHistoryChart
              machineId="test-id"
              startDatetime={new Date()}
              endDatetime={new Date()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
