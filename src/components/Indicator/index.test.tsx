import React from 'react';
import ReactDOM from 'react-dom';
import Indicator from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Indicator color="salmon" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('It should accept text', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Indicator color="salmon">With Text</Indicator>, div);
  ReactDOM.unmountComponentAtNode(div);
});
