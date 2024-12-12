import React from 'react';
import TimePicker from './index';
import ReactDOM from 'react-dom';

import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <TimePicker />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
