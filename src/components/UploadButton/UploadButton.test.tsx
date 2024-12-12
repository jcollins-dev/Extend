import React from 'react';
import ReactDOM from 'react-dom';
import UploadButton from './UploadButton';
import theme from 'themes';

import { ThemeProvider } from 'styled-components';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <UploadButton />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
