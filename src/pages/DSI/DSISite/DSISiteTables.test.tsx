import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import DSISiteTables from './DSISiteTables';
import { MachineStateNames } from 'types/dsi';

describe('DSI', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <DSISiteTables
              type="MACHINE"
              plantId="0013600000vxEDNAA2"
              machines={[
                {
                  id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
                  description: 'DSI-888-4409',
                  lineName: '',
                  status: MachineStateNames.Running,
                  numCurrentAlarms: 0,
                  numAlarmsOverPeriod: 0,
                  productionOverPeriod: 1440,
                  utilizationOverPeriod: 27.65,
                  configurationType: null,
                  businessUnit: 'DSI'
                }
              ]}
              isLoading={false}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
