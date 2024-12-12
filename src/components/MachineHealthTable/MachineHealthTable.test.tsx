import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import MachineHealthTable from './MachineHealthTable';
import theme from 'themes';
import { testMachineHealthTableData } from 'constants/testdata';

describe('MachineHealthTable', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <MachineHealthTable
          data={testMachineHealthTableData}
          onItemClick={() => { console.log('test')}}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
