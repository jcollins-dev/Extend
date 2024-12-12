import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import store from 'store';
import theme from 'themes';
import OeeWidget from '.';
import { asepticOEEMockData } from 'constants/testdata';
import { MachineType } from 'types/machine-health';

describe('OeeWidget', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <OeeWidget
              data={asepticOEEMockData}
              machineType={MachineType.Aseptic}
              isLoadingOEE={false}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
