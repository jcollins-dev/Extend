import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { SortState } from 'types';
import MachineManagementTable from '.';

describe('MachineManagementTable', () => {
  it('It should mount', () => {
    const div = document.createElement('div');

    const rows = [
        {
            id: "ABC0x1",
            salesforceMachineId:"AAA",
            description:"machine 1",
            customer:"InProgress",
            diagrams:"InProgress",
            tagList:"InProgress",
            maintenanceSchedule:"InProgress",
            provisionGateway:"InProgress",
            kpiThreshold: false
        },
        {
            id: "ABC0x2",
            salesforceMachineId:"BBB",
            description:"machine 2",
            customer:"InProgress",
            diagrams:"Done",
            tagList:"Incomplete",
            maintenanceSchedule:"None",
            provisionGateway:"Incomplete",
            kpiThreshold: true
        }
    ];
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <MachineManagementTable
          data={rows}
          sortState={{ column: 'machine', state: SortState.none }}
          sortColumnClicked={() => {
            /*pass*/
          }}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
