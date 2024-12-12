import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import { LineCardWidget } from './LineCardWidget';
import { default as theme } from 'themes';

describe('Tag Select', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <LineCardWidget
              businessUnitId={0}
              machineId="test"
              name="test"
              handleClick={jest.fn()}
              setUtilizationByMachine={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
