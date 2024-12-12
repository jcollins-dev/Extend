import React from 'react';
import ReactDOM from 'react-dom';
import MachineCard from '.';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { default as store } from 'store';
import { testMachine } from 'constants/testdata';
import { JBTRoutes } from 'constants/routes';
import { default as theme } from 'themes';

describe('PopUpPreviewCard', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[JBTRoutes.partsMachine.replace(':machineId', '1')]}>
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.parts}>
              <MachineCard machine={testMachine} />
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
