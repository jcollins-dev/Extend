import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

import AlertList from './AlertList';
import { default as theme } from 'themes';

describe('Alerts List', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertList
              alerts={[]}
              alertIdToEdit={undefined}
              description="test"
              isToggling={false}
              setAlertToDelete={jest.fn()}
              setAlertToEdit={jest.fn()}
              toggleAlert={jest.fn()}
              title="test"
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
