import React from 'react';
import ReactDOM from 'react-dom';
import SubAssemblyGridGallery from './SubAssemblyGridGallery';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SubAssemblyGridGallery />, div);
  ReactDOM.unmountComponentAtNode(div);
});
