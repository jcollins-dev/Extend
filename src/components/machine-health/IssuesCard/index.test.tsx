import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import IssuesCard from '.';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import { AlertLocation } from 'types/machine-health/alerts';
import { AlarmLocation } from 'types/machine-health/alarms';

describe('IssuesCard', () => {
  it('renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <IssuesCard
              machineId="test-id"
              alarmsLocation={AlarmLocation.PP}
              alertsLocation={AlertLocation.ProductProcessing}
              startTime={new Date('2022-01-01T00:00:00.000Z')}
              endTime={new Date('2022-01-01T00:01:00.000Z')}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
