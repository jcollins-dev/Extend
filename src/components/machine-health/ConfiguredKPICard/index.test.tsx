import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import ConfiguredKPICard from '.';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import { formatTagData } from './utils';
import { BaseTag } from 'types/protein';
import TwoColumnCard from 'components/KPICard/TwoColumnCard';

describe('ConfiguredKPICard', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ConfiguredKPICard label="TEST-LABEL" machineId="test-machine-id" />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('Formatting Data for ConfiguredKPICard', () => {
  test('it checks field name being empty string', () => {
    const input = [
      {
        type: 'state',
        id: 'DriveSystem01State',
        name: '',
        values: [
          {
            timestamp: '2023-04-25T16:28:06.603000+00:00',
            value: 1,
            name: 'Waiting to be selected'
          }
        ]
      }
    ] as BaseTag[];
    const output = [
      {
        unit: '',
        key: 'DriveSystem01State',
        value: 'Waiting to be selected (1)',
        tagType: 'state',
        tagValue: 1
      }
    ];
    expect(formatTagData(input)).toEqual(output);
  });

  test('it checks field name is undefined', () => {
    const input = [
      {
        type: 'state',
        id: 'DriveSystem01State',
        name: undefined,
        values: [
          {
            timestamp: '2023-04-25T16:28:06.603000+00:00',
            value: 1,
            name: 'Waiting to be selected'
          }
        ]
      }
    ] as BaseTag[];
    const output = [
      {
        unit: '',
        key: 'DriveSystem01State',
        value: 'Waiting to be selected (1)',
        tagType: 'state',
        tagValue: 1
      }
    ];
    expect(formatTagData(input)).toEqual(output);
  });

  test('it checks field value is empty array', () => {
    const input = [
      {
        type: 'state',
        id: 'DriveSystem01State',
        name: 'Drive System 1 State',
        values: []
      }
    ] as BaseTag[];
    const output = [
      {
        unit: 'Drive System 1 State',
        key: 'DriveSystem01State',
        value: '-',
        tagType: 'state',
        tagValue: undefined
      }
    ];
    expect(formatTagData(input)).toEqual(output);
  });

  test('it checks field value being empty string', () => {
    const input = [
      {
        type: 'state',
        id: 'DriveSystem01State',
        name: 'Drive System 1 State',
        values: [
          {
            timestamp: '2023-04-25T16:28:06.603000+00:00',
            value: '',
            name: 'Waiting to be selected'
          }
        ]
      }
    ] as BaseTag[];
    const output = [
      {
        unit: 'Drive System 1 State',
        key: 'DriveSystem01State',
        value: '-',
        tagType: 'state',
        tagValue: ''
      }
    ];
    expect(formatTagData(input)).toEqual(output);
  });
});

describe('Rendering of TwoColumnCard with different inputs', () => {
  it('Renders where name being empty string', () => {
    const output = [
      {
        unit: '',
        key: 'DriveSystem01State',
        value: 'Waiting to be selected (1)',
        color: '#303E47'
      }
    ];
    render(
      <ThemeProvider theme={theme}>
        <TwoColumnCard values={output || []} />
      </ThemeProvider>
    );
  });

  it('Renders where value is a dash', () => {
    const output = [
      {
        unit: 'Drive System 1 State',
        key: 'DriveSystem01State',
        value: '-',
        color: '#303E47'
      }
    ];
    render(
      <ThemeProvider theme={theme}>
        <TwoColumnCard values={output || []} />
      </ThemeProvider>
    );
  });

  it('Renders where value is an empty string', () => {
    const output = [
      {
        unit: 'Drive System 1 State',
        key: 'DriveSystem01State',
        value: '',
        color: '#303E47'
      }
    ];
    render(
      <ThemeProvider theme={theme}>
        <TwoColumnCard values={output || []} />
      </ThemeProvider>
    );
  });

  it('Renders where unit is an empty string', () => {
    const output = [
      {
        unit: '',
        key: 'DriveSystem01State',
        value: 'Waiting to be selected (1)',
        color: '#303E47'
      }
    ];
    render(
      <ThemeProvider theme={theme}>
        <TwoColumnCard values={output || []} />
      </ThemeProvider>
    );
  });
});
