import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

import AlertConfigTagForm from './AlertConfigTagForm';
import { default as theme } from 'themes';
import {
  AlertBoolean,
  AlertConfig,
  AlertConfigAlertLocation,
  AlertConfigType,
  AlertCriticality,
  AlertStateType
} from 'types/machine-health/alerts';

describe('AlertConfigTagForm', () => {
  const newAlert: AlertConfig = {
    id: undefined,
    machineId: undefined,
    name: 'test alert',
    description: 'test description',
    importance: AlertCriticality.Low,
    location: (Object.values(AlertConfigAlertLocation) as Array<AlertConfigAlertLocation>).map(
      (value) => value
    ),
    machineState: (Object.values(AlertStateType) as Array<AlertStateType>).map((value) => value),
    contacts: [],
    active: true,
    expunge: false,

    conditions: [
      {
        id: undefined,
        dataSourceType: 'tag',
        dataSource: undefined,
        triggerRule: AlertConfigType.Boolean,
        triggerValueFormat: undefined,
        orangeAlertRangeUpper: undefined,
        orangeAlertRangeLower: undefined,
        redAlertRangeUpper: undefined,
        redAlertRangeLower: undefined,
        targetSetpoint: undefined,
        targetBoolean: AlertBoolean.TRUE,
        timeframeOfMeanCalculation: undefined
      }
    ]
  };

  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertConfigTagForm alertToEdit={newAlert} onClose={jest.fn()} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should render an error message if no data is fetched', () => {
    const testComponent = (
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertConfigTagForm alertToEdit={newAlert} onClose={jest.fn()} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    render(testComponent);

    expect(screen.getByText('could_not_fetch_alert_details')).toBeInTheDocument();
  });
});
