import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

import MachinePerformanceToggle from '.';
import { default as theme } from 'themes';

describe('Machine Performance Toggle', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachinePerformanceToggle
              hasMachinePerformanceToggle={true}
              isMachinePerformanceActive={true}
              machinePerformanceWidget={undefined}
              machineId={'123'}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
