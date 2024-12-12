import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { DateRangeCalendar, staticDateRanges } from './DateRangeCalendar';
import { default as theme } from 'themes';

describe('DateRangeCalendar', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <DateRangeCalendar handleUpdate={jest.fn()} handleCancel={jest.fn()} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('staticDateRanges', () => {
  it('returns an array of static ranges', () => {
    const result = staticDateRanges();
    expect(result).toBeInstanceOf(Array);
  });
});
