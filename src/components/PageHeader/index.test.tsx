import React from 'react';
import ReactDOM from 'react-dom';
import PageHeader from '.';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <PageHeader heading="This is a header"/>
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
