import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import DriveTorqueRatio from '.';

describe('DriveTorqueRatio', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <DriveTorqueRatio
              machineId="test-machine"
              startTime={new Date()}
              endTime={new Date()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});