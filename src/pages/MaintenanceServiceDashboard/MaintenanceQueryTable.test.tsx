import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import { MaintenanceQueryTable } from './MaintenanceQueryTable';

describe('Maintenance Query Table', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MaintenanceQueryTable
              filter={null}
              notice={jest.fn()}
              headerBgColor="test"
              setSelectedPm={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
