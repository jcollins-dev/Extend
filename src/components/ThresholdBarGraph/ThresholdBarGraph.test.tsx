import React from 'react';
import ReactDOM from 'react-dom';
import ThresholdBarGraph from './ThresholdBarGraph';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ThresholdBarGraph />, div);
  ReactDOM.unmountComponentAtNode(div);
});
