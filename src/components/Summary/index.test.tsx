import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Summary from '.';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

describe('ExtendedMachineKpi', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Summary title="Summary title" data={{ Status: 'Active' }} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
