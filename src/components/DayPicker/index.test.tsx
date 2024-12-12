import React from 'react';
import DayPicker from './index';
import ReactDOM from 'react-dom';

import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <DayPicker />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
