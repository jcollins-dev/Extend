// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import DownloadLink from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DownloadLink type="PDF" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
