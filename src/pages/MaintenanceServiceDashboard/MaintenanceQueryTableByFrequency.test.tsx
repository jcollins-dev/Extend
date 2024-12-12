import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import { MaintenanceRunTimeBasedQueryTable } from './MaintenanceQueryTableByFrequency';

describe('Maintenance Run Time Based Query Table', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MaintenanceRunTimeBasedQueryTable
              filter={null}
              notice={jest.fn()}
              headerBgColor="test"
              setSelectedPm={jest.fn()}
              allEvents={[]}
              setAllRunTimeEvents={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
