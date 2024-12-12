import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import { MaintenanceFilters } from './MaintenanceFilters';
import { TabViews } from './MaintenanceServiceDashboardContents';

describe('Maintenance Filters', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MaintenanceFilters
              currentTab={TabViews.HighPriority}
              machines={[]}
              eventGroupsList={[]}
              priorityFilter={{}}
              setPriorityFilter={jest.fn()}
              subcomponentsList={[]}
              setHistoryFilter={jest.fn()}
              historyFilter={{}}
              setPlannedFilter={jest.fn()}
              plannedFilter={{}}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
