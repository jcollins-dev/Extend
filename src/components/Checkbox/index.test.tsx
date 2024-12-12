import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import TestRenderer, { act } from 'react-test-renderer';
import { render, screen } from '@testing-library/react';

// Theme
import theme from 'themes';

// Types
import { InputChangeHandler } from 'types';

import Checkbox from '.';

describe('Checkbox', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Checkbox />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should be checked if `checked` is set to true, and false if not', () => {
    const testElementChecked = (
      <ThemeProvider theme={theme}>
        <Checkbox checked />
      </ThemeProvider>
    );

    render(testElementChecked);
    expect(screen.getByRole('checkbox')).toHaveStyle(
      `background-color: ${theme.colors.buttons.primary.fill}`
    );
  });

  it('It should be have a white background if `checked` is not provided or false', () => {
    const testElementUnchecked = (
      <ThemeProvider theme={theme}>
        <Checkbox />
      </ThemeProvider>
    );

    render(testElementUnchecked);
    expect(screen.getByRole('checkbox')).toHaveStyle('background-color: white');
  });

  it('It should trigger the callback function provided on click', () => {
    let selected = false;
    const handleClick: InputChangeHandler = (event) => {
      selected = !selected;
    };

    const testElement = (
      <ThemeProvider theme={theme}>
        <Checkbox onChange={handleClick} />
      </ThemeProvider>
    );
    const testRenderer = TestRenderer.create(testElement);
    const testInstance = testRenderer.root;

    expect(selected).toBe(false);

    act(() => {
      testInstance.findByType('input').props.onChange();
    });

    expect(selected).toBe(true);
  });
});
