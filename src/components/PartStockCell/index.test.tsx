import React from 'react';
import ReactDOM from 'react-dom';
import PartStockCell from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PartStockCell />, div);
  ReactDOM.unmountComponentAtNode(div);
});
