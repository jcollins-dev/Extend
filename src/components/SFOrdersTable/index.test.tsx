import { mockPurchaseOrderData } from 'constants/testdata';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import SFOrdersTable from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <SFOrdersTable data={mockPurchaseOrderData} />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
