import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import MachineCleaning from '.';

describe('MachineConfigCleaning', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineCleaning isDirty={false} setIsDirty={() => undefined} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
