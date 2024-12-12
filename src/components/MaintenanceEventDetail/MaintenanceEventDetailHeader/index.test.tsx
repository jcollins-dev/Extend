import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MaintenanceEventDetailHeader from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <MaintenanceEventDetailHeader
        pmNextLevelOpen={true}
        bgColor={theme.colors.lightGrey1}
        title={'PM Detail'}
        onClose={jest.fn()}
        onHeaderClick={jest.fn()}
      />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
