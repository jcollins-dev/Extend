import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import { DSIKPIType, MachineHealthInterval } from 'types/dsi';
import KPIWidget from 'components/machine-health/widget/KPIWidget/index';

describe('KPIWidget', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <KPIWidget
              kpi={{
                key: DSIKPIType.Loading,
                values: [
                  {
                    title: 'Efficiency',
                    duration: 'Avg/last hr',
                    kpiType: DSIKPIType.LoadingEfficiency,
                    interval: MachineHealthInterval.LastHour,
                    includeHistoricData: true
                  },
                  {
                    title: 'Gap',
                    duration: 'Avg/last hr',
                    kpiType: DSIKPIType.LoadingGap,
                    interval: MachineHealthInterval.LastHour,
                    includeHistoricData: true
                  }
                ]
              }}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
