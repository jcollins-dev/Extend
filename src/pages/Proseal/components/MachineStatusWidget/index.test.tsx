import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import store from 'store';
import theme from 'themes';
import MachineStatusWidget from '.';

describe('MachineStatusWidget', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineStatusWidget
              currentStatus="Running"
              currentRecipe="Raspberry Portugal 125g"
              jobNumber={7861}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
