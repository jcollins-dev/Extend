import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import Divider from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Divider title="Performance" />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
