import { testMaintenanceEventData, testMaintenanceTaskData } from 'constants/testdata';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MaintenanceEventCloseOutSurvey from '.';
import { default as store } from 'store';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <MaintenanceEventCloseOutSurvey
          maintenanceEvent={testMaintenanceEventData[0]}
          surveyCompletedAsPlanned={true}
          onSubmitClick={jest.fn()}
          machineDescription="machine_description"
        />
      </Provider>
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
