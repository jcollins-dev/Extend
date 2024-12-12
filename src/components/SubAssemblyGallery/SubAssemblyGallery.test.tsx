import React from 'react';
import ReactDOM from 'react-dom';
import SubAssemblyGallery from './SubAssemblyGallery';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SubAssemblyGallery />, div);
  ReactDOM.unmountComponentAtNode(div);
});
