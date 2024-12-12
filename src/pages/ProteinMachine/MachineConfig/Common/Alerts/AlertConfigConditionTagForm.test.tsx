import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

import AlertConfigConditionTagForm from './AlertConfigConditionTagForm';
import { default as theme } from 'themes';
import {
  AlertBoolean,
  AlertConfig,
  AlertConfigAlertLocation,
  AlertConfigType,
  AlertCriticality,
  AlertStateType
} from 'types/machine-health/alerts';
import { AlertValidationConditionConfig, CONDITION_VALIDATION_OBJECT } from './FormElementsTypes';

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

  const validationObject = {
    id: true,
    name: true,
    description: true,
    importance: true,
    location: true,
    machineState: true,
    active: true,
    conditions: [{ ...CONDITION_VALIDATION_OBJECT }] as Array<AlertValidationConditionConfig>,
    minimumOccurrences: true
  };

  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertConfigConditionTagForm
              conditionToEdit={newAlert.conditions?.[0] ?? null}
              idx={0}
              tagList={[]}
              deletable={true}
              deleteCondition={jest.fn()}
              validationAlertData={validationObject}
              handleUpdateValue={jest.fn()}
              handleUpdateAlertsValues={jest.fn()}
              setValidationAlertData={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
