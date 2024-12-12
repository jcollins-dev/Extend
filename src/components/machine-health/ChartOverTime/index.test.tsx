import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import ChartOverTime from '.';
import { DSIKPIType, MachineHealthInterval } from 'types/dsi';

describe('ChartOverTime', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ChartOverTime
              kpiType={DSIKPIType.BeltSpeed}
              interval={MachineHealthInterval.LastMonth}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
