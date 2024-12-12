import { testMaintenanceEventData } from 'constants/testdata';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { default as store } from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AssignAndScheduleEvent from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AssignAndScheduleEvent
          maintenanceEvent={testMaintenanceEventData[0]}
          onSubmitClick={jest.fn()}
        />
      </Provider>
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
