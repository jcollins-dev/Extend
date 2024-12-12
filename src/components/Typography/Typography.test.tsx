import React from 'react';
import ReactDOM from 'react-dom';
import Typography from './Typography';
import theme from 'themes';

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Typography />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('Should render children', () => {
  render(
    <ThemeProvider theme={theme}>
      <Typography>test</Typography>
    </ThemeProvider>
  );
  expect(screen.getByText('test'));
});

it('Should have correct tag', () => {
  render(
    <ThemeProvider theme={theme}>
      <Typography variant="inputlabel">test</Typography>
    </ThemeProvider>
  );
  expect(document.getElementsByTagName('label'));
});
