import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { default as store } from 'store';

import { testMaintenanceEventData } from 'constants/testdata';
import PredictiveMaintenanceEventIgnoreSurvey from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PredictiveMaintenanceEventIgnoreSurvey
          maintenanceEvent={testMaintenanceEventData[0]}
          onSubmitClick={jest.fn()}
          onClose={jest.fn()}
        />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
