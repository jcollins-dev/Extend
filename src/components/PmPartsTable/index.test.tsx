import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

// Theme
import theme from 'themes';

// Types
import { PreventativeMaintenancePart } from 'types';

import PmPartsTable from '.';

export const testPmParts: PreventativeMaintenancePart[] = [
  {
    id: '1',
    description: 'JBT 009080554 Caster, 4", Swivel, with Lock, Stainless Steel',
    sku: '003091001',
    stock: 4,
    leadTime: 22,
    price: 195.99,
    priceUnit: '$',
    partTypes: ['caster'],
    imgURL: '',
    quantity: 3,
    autoOrder: false,
    selected: true
  },
  {
    id: '2',
    description: 'JBT 06000108 Manifold, Juice, MFJ',
    sku: '06000108',
    stock: 5,
    leadTime: 22,
    price: 320.32,
    priceUnit: '$',
    partTypes: ['manifold'],
    imgURL: '',
    quantity: 5,
    autoOrder: false
  },
  {
    id: '3',
    description: 'JBT 009080554 Caster, 4", Swivel, with Lock, Stainless Steel',
    sku: '003091002',
    stock: 51,
    leadTime: 7,
    price: 190.19,
    priceUnit: '$',
    partTypes: ['caster'],
    imgURL: '',
    quantity: 1,
    autoOrder: true,
    selected: true
  }
];

describe('PmPartsTable', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <PmPartsTable
          data={[]}
          leadTimeThreshold={1.0}
          stockThreshold={2}
          selectionHandler={(index) => {
            console.log('index: ', index);
          }}
          quantityInputChangeHandler={(index) => {
            console.log('index: ', index);
          }}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should have 4 rows (1 header + 3 data) in the table if 3 data items are provided', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <PmPartsTable
          data={testPmParts}
          leadTimeThreshold={1.0}
          stockThreshold={2}
          selectionHandler={(index) => {
            console.log('index: ', index);
          }}
          quantityInputChangeHandler={(index) => {
            console.log('index: ', index);
          }}
        />
      </ThemeProvider>
    );

    render(testComponent);
    expect(screen.getAllByRole('row').length).toBe(4);
  });

  it('It should have 2 checked checkboxes if two of the data items provide the selected property', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <PmPartsTable
          data={testPmParts}
          leadTimeThreshold={1.0}
          stockThreshold={2}
          selectionHandler={(index) => {
            console.log('index: ', index);
          }}
          quantityInputChangeHandler={(index) => {
            console.log('index: ', index);
          }}
        />
      </ThemeProvider>
    );

    render(testComponent);
    expect(screen.getAllByRole('checkbox').length).toBe(3);
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('checked');
    expect(screen.getAllByRole('checkbox')[1].hasAttribute('checked')).toBeFalsy();
    expect(screen.getAllByRole('checkbox')[2]).toHaveAttribute('checked');
  });
});
