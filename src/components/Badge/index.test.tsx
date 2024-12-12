import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Badge from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Badge />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
