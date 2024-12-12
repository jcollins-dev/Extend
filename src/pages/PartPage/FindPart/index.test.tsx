import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import theme from 'themes';
import { default as store } from 'store';
import FindPart from '.';
import { testMachine } from 'constants/testdata';

describe('FindPart', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <FindPart machine={testMachine} machineId={testMachine.id} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
