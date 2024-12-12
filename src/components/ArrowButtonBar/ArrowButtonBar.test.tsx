import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

import { ArrowButtonBar } from './ArrowButtonBar';
import { default as theme } from 'themes';

import { Typography } from 'components';

function handlePress() {
  return;
}

function buttonContents(i: number) {
  return <Typography variant="h2">Test{i}</Typography>;
}

describe('ArrowButtonBar', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <ArrowButtonBar
          numButtons={3}
          activeButton={1}
          handlePress={handlePress}
          buttonContents={buttonContents}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should load 3 buttons', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <ArrowButtonBar
          numButtons={3}
          activeButton={1}
          handlePress={handlePress}
          buttonContents={buttonContents}
        />
      </ThemeProvider>
    );
    render(testComponent);
    expect(screen.getAllByText('Test0').length).toBe(1);
    expect(screen.getAllByText('Test1').length).toBe(1);
    expect(screen.getAllByText('Test2').length).toBe(1);
  });
});
