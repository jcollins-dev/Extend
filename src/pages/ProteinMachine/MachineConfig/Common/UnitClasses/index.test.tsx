import React, { MutableRefObject } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import MachineConfigUnitClasses, { EditField, generateColumnConfigs } from '.';

describe('MachineConfigUnitClasses', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineConfigUnitClasses />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('EditField', () => {
  const ref = React.createRef();

  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <EditField
              unitClassName="test"
              columnId="unitClassEMEA"
              displayValue="test"
              placeholder="test"
              currentlyEditingValue={ref as unknown as MutableRefObject<string>}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('generateColumnConfigs', () => {
  const ref = React.createRef();
  it('generates column configs', () => {
    const columnConfigs = generateColumnConfigs(
      'test',
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      ref as unknown as MutableRefObject<string>,
      ref as unknown as MutableRefObject<string>
    );
    expect(columnConfigs).toStrictEqual([
      {
        title: 'Class',
        dataIndex: 'name',
        key: 'name',
        render: expect.any(Function)
      },
      {
        title: 'EMEA',
        dataIndex: 'unitClassEMEA',
        key: 'unitClassEMEA',
        render: expect.any(Function)
      },
      {
        title: 'NA',
        dataIndex: 'unitClassNA',
        key: 'unitClassNA',
        render: expect.any(Function)
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        render: expect.any(Function)
      }
    ]);
  });
});
