import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import ReactDOM from 'react-dom';
import AssignAndScheduleTaskCard from './AssignAndScheduleTaskCard';
import { testMaintenanceEventData } from 'constants/testdata';
import CloseOutSurveyCard from './CloseOutSurveyCard';
import OrderPartsKitCard from './OrderPartsKitCard';
import { default as store } from 'store';
import { Provider } from 'react-redux';

describe('MaintenanceEventDetail Cards', () => {
  const div = document.createElement('div');
  it('Should render an assignment card', () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AssignAndScheduleTaskCard
            maintenanceEvent={testMaintenanceEventData[0]}
            onClick={jest.fn()}
            onClear={jest.fn()}
          />
        </Provider>
      </ThemeProvider>,
      div
    );
  });

  it('Should render a close out survey card', () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CloseOutSurveyCard
            event={testMaintenanceEventData[0]}
            surveyClickHandler={jest.fn()}
            refresh={jest.fn()}
          />
        </Provider>
      </ThemeProvider>,
      div
    );
  });

  it('Should render a close out survey card', () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <OrderPartsKitCard maintenanceEvent={testMaintenanceEventData[0]} onClick={jest.fn()} />
        </Provider>
      </ThemeProvider>,
      div
    );
  });
});
