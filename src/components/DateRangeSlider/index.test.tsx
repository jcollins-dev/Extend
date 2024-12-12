import React from 'react';
import ReactDOM from 'react-dom';
import DateRangeSlider from '.';

import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <DateRangeSlider />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
