import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import { MachineStatusIcon } from './MachineStatusIcon';
import { default as theme } from 'themes';

describe('MachineStatusIcon', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineStatusIcon machineId="" />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
