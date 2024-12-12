import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import HistoricalRecipes from '.';

describe('MachineConfigHistoricRecipes,', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <HistoricalRecipes setIsDirty={jest.fn} isDirty={false} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
