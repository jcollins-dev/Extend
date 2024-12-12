import React from 'react';
import ReactDOM from 'react-dom';
import SubAssemblyZoom from './SubAssemblyZoom';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SubAssemblyZoom />, div);
  ReactDOM.unmountComponentAtNode(div);
});
