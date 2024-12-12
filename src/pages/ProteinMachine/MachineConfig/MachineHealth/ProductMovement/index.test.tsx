import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import MachineProductMovement from '.';
import { WidgetTableProvider } from 'components/machine-health/configurator/WidgetTable/WidgetTableContext';

describe('MachineProductMovement', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <WidgetTableProvider>
              <MachineProductMovement isDirty={false} setIsDirty={() => undefined} />
            </WidgetTableProvider>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
