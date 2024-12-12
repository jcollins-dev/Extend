import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import AlertSetup from './AlertSetup';
import { FrequencyDropdown } from './FrequencyDropdown';
import { SlidingWindow } from './SlidingWindow';
import Reminder from './Reminder';
import TriggerAlert from './TriggerAlert';
import { ToggleButton } from './ToggleSwitch';
import { Dropdown } from './Dropdown';
import { AlertEnumTypes, TAlertData, TReminder, TTrigger } from 'types/machine-health/alerts';

const AlertUnitTypes: AlertEnumTypes = {
  alertState: ['ENABLED', 'DISABLED', 'DRAFT'],
  alertPriority: ['HIGH', 'MEDIUM', 'LOW'],
  alertFrequencyUnits: ['SECONDS', 'MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS'],
  slidingWindowUnits: ['SECONDS', 'MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS'],
  logicOperator: ['AND', 'OR'],
  logicStatementValueType: ['STRING', 'INTEGER', 'FLOAT'],
  logicStatementRelativity: ['UPPER', 'LOWER'],
  logicStatementComparisonOperator: [
    'EQUAL',
    'NOT_EQUAL',
    'GREATER_THAN',
    'GREATER_THAN_OR_EQUAL',
    'LESS_THAN',
    'LESS_THAN_OR_EQUAL',
    'BETWEEN',
    'CONTAINS'
  ],
  reminderUnits: ['HOURS', 'DAYS', 'MONTHS'],
  triggerType: ['MATCHES', 'DURATION'],
  triggerUnits: ['SECONDS', 'MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS']
};

const testReminderValues: TReminder = {
  value: 2,
  stop_after: 10,
  units: 'HOURS'
};

const testTriggerValues: TTrigger = {
  type: 'MATCHES',
  value: 10,
  units: 'SECONDS'
};

const testAlertDataValues: TAlertData = {
  name: 'Test',
  description: 'description',
  message: 'message',
  state: 'ENABLED',
  priority: 'HIGH',
  slidingWindowValue: 20,
  slidingWindowUnits: 'SECONDS',
  frequencyValue: 20,
  frequencyUnits: 'SECONDS'
};

describe('AlertSetup', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertSetup
              AlertUnitTypes={AlertUnitTypes}
              alertData={testAlertDataValues}
              isAlertTypeFetching={true}
              onHandleChange={jest.fn()}
              isTriggerEnabled={true}
              setIsReminderEnabled={jest.fn()}
              isReminderEnabled={true}
              onReminderHandleChange={jest.fn()}
              reminderValues={testReminderValues}
              onTriggerHandleChange={jest.fn()}
              triggerValues={testTriggerValues}
              onRadioAndTriggerHandleChange={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('FrequencyDropdown', () => {
  it('Renders FrequencyDropdown', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <FrequencyDropdown
              alertFrequencyUnits={AlertUnitTypes['alertFrequencyUnits']}
              alertData={testAlertDataValues}
              onDropdownChange={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('SlidingWindow', () => {
  it('Renders SlidingWindow', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <SlidingWindow
              alertFrequencyUnits={AlertUnitTypes['alertFrequencyUnits']}
              alertData={testAlertDataValues}
              onDropdownChange={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('Reminder', () => {
  it('Renders Reminder', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Reminder
              alertReminderUnits={AlertUnitTypes['reminderUnits']}
              reminderValues={testReminderValues}
              onDropdownChange={jest.fn()}
              setIsReminderEnabled={jest.fn()}
              isReminderEnabled={true}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('TriggerAlert', () => {
  it('Renders TriggerAlert', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <TriggerAlert
              alertFrequencyUnits={AlertUnitTypes['alertFrequencyUnits']}
              alertTriggerTypes={AlertUnitTypes['triggerType']}
              onDropdownChange={jest.fn()}
              triggerValues={testTriggerValues}
              isTriggerEnabled={true}
              onRadioAndTriggerHandleChange={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('ToggleButton', () => {
  it('Renders ToggleButton', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ToggleButton toggleSelected={jest.fn()} selected={true} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('Dropdown', () => {
  it('Renders Dropdown', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Dropdown
              vals={AlertUnitTypes['alertFrequencyUnits']}
              onDropdownChange={jest.fn()}
              value="Dropdown"
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
