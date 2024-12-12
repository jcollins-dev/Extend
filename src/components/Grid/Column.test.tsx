import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../themes';
import Column from './Column';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Column />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
