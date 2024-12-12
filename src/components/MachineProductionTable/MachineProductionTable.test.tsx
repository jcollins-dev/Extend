import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import MachineProductionTable from './MachineProductionTable';
import theme from 'themes';
import { machineHealthProductionData } from 'constants/testdata';
import { MachineHealthProductionData } from 'types';

const addKeysToData = (keyPrefix: string, data: MachineHealthProductionData[]) => {
  return data.map((item) => {
    return {
      ...item,
      key: `${keyPrefix}-${item.id}`
    };
  });
};

describe('MachineProductionTable', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <MachineProductionTable
          sortState={{}}
          sortHandler={jest.fn}
          onItemClick={jest.fn}
          machineColumnTitle="Machine"
          data={addKeysToData('prefix', machineHealthProductionData)}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
