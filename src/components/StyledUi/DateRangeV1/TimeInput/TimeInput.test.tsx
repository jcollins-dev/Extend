import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { TimeInput } from './TimeInput';
import { default as theme } from 'themes';

describe('TimeInput', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TimeInput date={new Date()} handleUpdate={jest.fn()} className="test" />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
