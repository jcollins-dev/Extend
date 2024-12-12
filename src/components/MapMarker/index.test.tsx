import React from 'react';
import ReactDOM from 'react-dom';
import MapMarker from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MapMarker />, div);
  ReactDOM.unmountComponentAtNode(div);
});
