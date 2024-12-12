import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import MaintenanceTable from './MaintenanceTable';
import theme from 'themes';
import { testMaintenanceEventData } from 'constants/testdata';
import { MaintenanceEventTableRow } from 'types/maintenance';
import { SortState } from 'types';
import store from 'store';
import { Provider } from 'react-redux';

describe('MaintenanceTable', () => {
  it('It should mount', () => {
    const div = document.createElement('div');

    const rows = testMaintenanceEventData.map(
      (item) =>
        ({
          ...item,
          // Decorate the maintenance task with a next step date, so that the table can order on this field
          // TODO - work out what this date is. It may come from different fields from within the task, depending on the task
          nextStep: 'Create Order'
        } as MaintenanceEventTableRow)
    );
    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MaintenanceTable
            data={rows}
            sortState={{ column: SortState.none, state: SortState.none }}
            sortColumnClicked={() => {
              /*pass*/
            }}
          />
        </ThemeProvider>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
