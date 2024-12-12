import React from 'react';
import ReactDOM from 'react-dom';
import TrendlineGraph from './TrendlineGraph';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TrendlineGraph />, div);
  ReactDOM.unmountComponentAtNode(div);
});