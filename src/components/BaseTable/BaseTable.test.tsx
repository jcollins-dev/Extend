import { SortState } from 'types';
import { PartDataWithKey } from 'types/parts';
import { render, screen, within } from '@testing-library/react';

import BaseTable from './BaseTable';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { default as theme } from 'themes';

const testColumnConfigs = [
  {
    title: 'Part',
    dataIndex: 'description',
    key: 'part',
    width: '19.375rem',
    sortState: SortState.unsorted
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    width: '6.25rem',
    sortState: SortState.unsorted
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    width: '3.125rem'
  },
  {
    title: 'Avg Lead Time',
    dataIndex: 'leadTime',
    key: 'leadTime',
    width: '6.875rem',
    sortState: SortState.unsorted
  },
  { title: 'Price', dataIndex: 'price', key: 'price', width: '5.625rem' }
];

const testData: PartDataWithKey[] = [
  {
    id: '1',
    sku: '123456',
    stock: 4,
    leadTime: 22,
    price: 10.08,
    priceUnit: '$',
    partTypes: ['caster'],
    key: 'part-1',
    description: 'Part1'
  },
  {
    id: '2',
    sku: '123457',
    stock: 5,
    leadTime: 22,
    price: 195.99,
    priceUnit: '$',
    partTypes: ['manifold'],
    key: 'part-2',
    description: 'Part2'
  },
  {
    id: '3',
    sku: '123458',
    stock: 51,
    leadTime: 7,
    price: 43.12,
    priceUnit: '$',
    partTypes: ['caster'],
    key: 'part-3',
    description: 'Part3'
  }
];

describe('BaseTable', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <BaseTable columnConfigs={testColumnConfigs} data={testData} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should have: a table, 4 rows (1 header row, 3 content rows), and 20 header columns (5 per row)', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <BaseTable columnConfigs={testColumnConfigs} data={testData} />
      </ThemeProvider>
    );

    render(testComponent);
    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.getAllByRole('columnheader').length).toBe(20);
    expect(screen.getAllByRole('row').length).toBe(4);
  });

  it('It should have the expected values for headers', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <BaseTable columnConfigs={testColumnConfigs} data={testData} />
      </ThemeProvider>
    );

    render(testComponent);
    const table = screen.getByRole('table');
    // Get the header row
    const headerRow = within(table).getAllByRole('row')[0];
    testColumnConfigs.forEach((col) => {
      expect(within(headerRow).getByText(col.title)).toBeInTheDocument();
    });
  });

  it('It should have the expected values for table content', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <BaseTable columnConfigs={testColumnConfigs} data={testData} />
      </ThemeProvider>
    );

    render(testComponent);
    const table = screen.getByRole('table');
    // Get the rows
    const rows = within(table).getAllByRole('row');
    rows.slice(1).forEach((row, i) => {
      expect(within(row).getByText(testData[i].description)).toBeInTheDocument();
    });
  });

  it('It should render a title row if the details of one are provided', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <BaseTable
          columnConfigs={testColumnConfigs}
          data={testData}
          title="test title"
          titleIcon={faHistory}
        />
      </ThemeProvider>
    );

    render(testComponent);
    expect(screen.getByText('test title')).toBeInTheDocument();
  });
});
