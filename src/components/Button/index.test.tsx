import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Button from '.';
import theme from 'themes';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Button />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
